"use client";

import { useState, useEffect } from "react";
import { Plus, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Material, transformMaterialFromDb } from "@/lib/types/materials";
import { transformOrderForDb, transformOrderFromDb } from "@/lib/types/orders";

interface SuggestedOrder {
  materialId: string;
  materialName: string;
  currentInventory: number;
  neededInventory: number;
  pendingOrderQuantity: number;
  effectiveInventory: number; // current + pending orders
  shortfall: number;
  unit: string;
  supplier?: string;
  unitCost?: number;
  estimatedTotal?: number;
}

interface SuggestedOrdersProps {
  onOrderAdded?: () => void; // Callback to refresh orders list
}

export function SuggestedOrders({ onOrderAdded }: SuggestedOrdersProps) {
  const [suggestedOrders, setSuggestedOrders] = useState<SuggestedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingOrders, setAddingOrders] = useState<Set<string>>(new Set());
  const supabase = createClient();

  useEffect(() => {
    fetchSuggestedOrders();
  }, []);

  const fetchSuggestedOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch materials
      const { data: materialsData, error: materialsError } = await supabase
        .from('materials')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (materialsError) throw materialsError;

      // Fetch pending orders (not delivered or cancelled)
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('material_id, quantity')
        .in('status', ['ordered', 'processing', 'shipped']);

      if (ordersError) throw ordersError;

      const materials = materialsData?.map(transformMaterialFromDb) || [];
      const pendingOrders = ordersData?.map(transformOrderFromDb) || [];
      
      // Calculate pending quantities by material
      const pendingQuantitiesByMaterial = pendingOrders.reduce((acc, order) => {
        acc[order.materialId] = (acc[order.materialId] || 0) + order.quantity;
        return acc;
      }, {} as Record<string, number>);

      // Filter materials where needed > (current inventory + pending orders)
      const lowStockMaterials = materials.filter(material => {
        const pendingQuantity = pendingQuantitiesByMaterial[material.id] || 0;
        const effectiveInventory = material.currentInventory + pendingQuantity;
        return material.neededInventory > effectiveInventory;
      });

      const suggestions: SuggestedOrder[] = lowStockMaterials.map(material => {
        const pendingQuantity = pendingQuantitiesByMaterial[material.id] || 0;
        const effectiveInventory = material.currentInventory + pendingQuantity;
        const shortfall = material.neededInventory - effectiveInventory;
        const estimatedTotal = material.unitCost ? material.unitCost * shortfall : undefined;

        return {
          materialId: material.id,
          materialName: material.name,
          currentInventory: material.currentInventory,
          neededInventory: material.neededInventory,
          pendingOrderQuantity: pendingQuantity,
          effectiveInventory,
          shortfall,
          unit: material.unit,
          supplier: material.supplier,
          unitCost: material.unitCost,
          estimatedTotal
        };
      });

      setSuggestedOrders(suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching suggested orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = async (suggestion: SuggestedOrder) => {
    try {
      setAddingOrders(prev => new Set(prev).add(suggestion.materialId));

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Calculate expected delivery date (7 days from now as default)
      const expectedDelivery = new Date();
      expectedDelivery.setDate(expectedDelivery.getDate() + 7);

      // Create order data
      const orderData = transformOrderForDb({
        materialId: suggestion.materialId,
        quantity: suggestion.shortfall,
        unitPrice: suggestion.unitCost,
        totalAmount: suggestion.estimatedTotal,
        supplier: suggestion.supplier,
        expectedDeliveryDate: expectedDelivery.toISOString().split('T')[0],
        status: 'ordered' as const,
        notes: `Auto-suggested order to meet inventory needs (${suggestion.shortfall} ${suggestion.unit})`,
        userId: user.id
      });

      const { error } = await (supabase as any)
        .from('orders')
        .insert([orderData]);

      if (error) throw error;

      // Remove this suggestion from the list since order was created
      setSuggestedOrders(prev => 
        prev.filter(s => s.materialId !== suggestion.materialId)
      );

      // Notify parent component to refresh orders list
      if (onOrderAdded) {
        onOrderAdded();
      }

    } catch (err) {
      console.error('Error creating order:', err);
    } finally {
      setAddingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(suggestion.materialId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">Suggested Orders</h3>
        </div>
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-orange-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded animate-pulse"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-48"></div>
                </div>
              </div>
              <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">Suggested Orders</h3>
        </div>
        <div className="text-center py-4">
          <p className="text-red-600 text-sm">Error loading suggestions: {error}</p>
          <Button 
            onClick={fetchSuggestedOrders} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (suggestedOrders.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900">Suggested Orders</h3>
        </div>
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">All materials are sufficiently stocked!</p>
          <p className="text-sm text-gray-400 mt-1">
            Suggestions will appear when needed inventory exceeds current inventory.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-orange-500" />
        <h3 className="text-lg font-semibold text-gray-900">Suggested Orders</h3>
        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
          {suggestedOrders.length} suggestion{suggestedOrders.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="space-y-3">
        {suggestedOrders.map((suggestion) => (
          <div 
            key={suggestion.materialId} 
            className="flex items-center justify-between p-4 border rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 bg-orange-200 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{suggestion.materialName}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span>
                    Need: <span className="font-medium text-orange-700">{suggestion.shortfall} {suggestion.unit}</span>
                  </span>
                  <span>•</span>
                  <span>Current: {suggestion.currentInventory} {suggestion.unit}</span>
                  {suggestion.pendingOrderQuantity > 0 && (
                    <>
                      <span>•</span>
                      <span>Pending: <span className="font-medium text-blue-600">{suggestion.pendingOrderQuantity} {suggestion.unit}</span></span>
                    </>
                  )}
                  <span>•</span>
                  <span>Target: {suggestion.neededInventory} {suggestion.unit}</span>
                  {suggestion.supplier && (
                    <>
                      <span>•</span>
                      <span>{suggestion.supplier}</span>
                    </>
                  )}
                </div>
                {suggestion.pendingOrderQuantity > 0 && (
                  <div className="text-xs text-blue-600 mt-1">
                    Effective inventory: {suggestion.effectiveInventory} {suggestion.unit} (includes pending orders)
                  </div>
                )}
                {suggestion.estimatedTotal && (
                  <div className="text-sm text-gray-600 mt-1">
                    Estimated cost: <span className="font-medium">${suggestion.estimatedTotal.toFixed(2)}</span>
                    {suggestion.unitCost && (
                      <span className="text-gray-400"> (${suggestion.unitCost.toFixed(2)}/{suggestion.unit})</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <Button
              onClick={() => handleAddOrder(suggestion)}
              disabled={addingOrders.has(suggestion.materialId)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              size="sm"
            >
              {addingOrders.has(suggestion.materialId) ? (
                'Adding...'
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Order
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
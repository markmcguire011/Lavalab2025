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
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Suggested Orders</h3>
        <div className="space-y-2">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center justify-between p-3 border rounded bg-gray-50">
              <div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-32 mb-1"></div>
                <div className="h-2 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Suggested Orders</h3>
        <div className="text-center py-3">
          <p className="text-red-600 text-xs">Error loading suggestions</p>
          <Button 
            onClick={fetchSuggestedOrders} 
            variant="outline" 
            size="sm" 
            className="mt-1 h-7 px-3 text-xs"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (suggestedOrders.length === 0) {
    return null; // Don't show anything when there are no suggestions
  }

  return (
    <div className="space-y-3 mt-8 pt-6 border-t">
      <h3 className="text-sm font-medium text-gray-700">
        Suggested Orders ({suggestedOrders.length})
      </h3>
      
      <div className="space-y-2">
        {suggestedOrders.map((suggestion) => (
          <div 
            key={suggestion.materialId} 
            className="flex items-center justify-between p-3 border rounded bg-gray-50"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{suggestion.materialName}</span>
              </div>
              {suggestion.estimatedTotal && (
                <div className="text-xs text-gray-600 mt-1">
                  Est. ${suggestion.estimatedTotal.toFixed(2)}
                  {suggestion.supplier && <span> • {suggestion.supplier}</span>}
                </div>
              )}
            </div>
            <span className="text-xs text-gray-500">Need {suggestion.shortfall} {suggestion.unit}</span>
            <Button
              onClick={() => handleAddOrder(suggestion)}
              disabled={addingOrders.has(suggestion.materialId)}
              variant="outline"
              size="sm"
              className="ml-3 h-7 px-3 text-xs"
            >
              {addingOrders.has(suggestion.materialId) ? 'Adding...' : 'Order'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
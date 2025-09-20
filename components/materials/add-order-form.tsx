"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { Material, transformMaterialFromDb } from "@/lib/types/materials";

interface AddOrderFormProps {
  onSubmit: (orderData: OrderFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface OrderFormData {
  materialId: string;
  quantity: number;
  notes?: string;
}

export function AddOrderForm({ onSubmit, onCancel, isLoading = false }: AddOrderFormProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [formData, setFormData] = useState<OrderFormData>({
    materialId: '',
    quantity: 1,
    notes: ''
  });
  const supabase = createClient();

  useEffect(() => {
    fetchMaterials();
  }, []);


  const fetchMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;

      const transformedMaterials = data?.map(transformMaterialFromDb) || [];
      setMaterials(transformedMaterials);
    } catch (err) {
      console.error('Error fetching materials:', err);
    } finally {
      setLoadingMaterials(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.materialId || !formData.quantity) {
      return;
    }

    // Create clean data object, removing empty optional fields
    const cleanData: OrderFormData = {
      materialId: formData.materialId,
      quantity: formData.quantity,
      ...(formData.notes && { notes: formData.notes })
    };

    onSubmit(cleanData);
  };

  const handleInputChange = (field: keyof OrderFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMaterialChange = (materialId: string) => {
    setFormData(prev => ({
      ...prev,
      materialId
    }));
  };

  // Get selected material details
  const selectedMaterial = materials.find(m => m.id === formData.materialId);
  
  // Calculate order total
  const orderTotal = selectedMaterial?.unitCost 
    ? (selectedMaterial.unitCost * formData.quantity).toFixed(2)
    : null;

  // Get estimated delivery date (2 weeks from now)
  const getEstimatedDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="materialId">Material *</Label>
          {loadingMaterials ? (
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <select
              id="materialId"
              value={formData.materialId}
              onChange={(e) => handleMaterialChange(e.target.value)}
              required
              disabled={isLoading}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a material</option>
              {materials.map(material => (
                <option key={material.id} value={material.id}>
                  {material.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
            placeholder="1"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Additional notes about this order"
            disabled={isLoading}
            rows={3}
          />
        </div>
      </div>

      {/* Order Summary */}
      {formData.materialId && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Order Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Supplier:</span>
              <span className="text-gray-600">
                {selectedMaterial?.supplier || 'Not specified'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Order Total:</span>
              <span className="text-gray-600">
                {orderTotal ? `$${orderTotal}` : 'Price not available'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Estimated Delivery:</span>
              <span className="text-gray-600">{getEstimatedDeliveryDate()}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-brand-500 hover:bg-brand-600 text-white"
          disabled={isLoading || !formData.materialId || !formData.quantity}
        >
          {isLoading ? 'Creating...' : 'Create Order'}
        </Button>
      </div>
    </form>
  );
}
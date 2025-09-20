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
  unitPrice?: number;
  totalAmount?: number;
  supplier?: string;
  supplierOrderId?: string;
  expectedDeliveryDate?: string;
  notes?: string;
}

export function AddOrderForm({ onSubmit, onCancel, isLoading = false }: AddOrderFormProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [formData, setFormData] = useState<OrderFormData>({
    materialId: '',
    quantity: 1,
    unitPrice: undefined,
    totalAmount: undefined,
    supplier: '',
    supplierOrderId: '',
    expectedDeliveryDate: '',
    notes: ''
  });
  const supabase = createClient();

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    // Auto-calculate total amount when quantity or unit price changes
    if (formData.quantity && formData.unitPrice) {
      setFormData(prev => ({
        ...prev,
        totalAmount: prev.quantity * (prev.unitPrice || 0)
      }));
    }
  }, [formData.quantity, formData.unitPrice]);

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
      ...(formData.unitPrice && { unitPrice: formData.unitPrice }),
      ...(formData.totalAmount && { totalAmount: formData.totalAmount }),
      ...(formData.supplier && { supplier: formData.supplier }),
      ...(formData.supplierOrderId && { supplierOrderId: formData.supplierOrderId }),
      ...(formData.expectedDeliveryDate && { expectedDeliveryDate: formData.expectedDeliveryDate }),
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
    const selectedMaterial = materials.find(m => m.id === materialId);
    setFormData(prev => ({
      ...prev,
      materialId,
      supplier: selectedMaterial?.supplier || '',
      unitPrice: selectedMaterial?.unitCost || undefined
    }));
  };

  // Get default delivery date (7 days from now)
  const getDefaultDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
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
                  {material.name} {material.supplier && `(${material.supplier})`}
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
          <Label htmlFor="unitPrice">Unit Price ($)</Label>
          <Input
            id="unitPrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.unitPrice || ''}
            onChange={(e) => handleInputChange('unitPrice', parseFloat(e.target.value) || undefined)}
            placeholder="0.00"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="totalAmount">Total Amount ($)</Label>
          <Input
            id="totalAmount"
            type="number"
            min="0"
            step="0.01"
            value={formData.totalAmount || ''}
            onChange={(e) => handleInputChange('totalAmount', parseFloat(e.target.value) || undefined)}
            placeholder="Auto-calculated"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="supplier">Supplier</Label>
          <Input
            id="supplier"
            value={formData.supplier}
            onChange={(e) => handleInputChange('supplier', e.target.value)}
            placeholder="Supplier name"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="supplierOrderId">Supplier Order ID</Label>
          <Input
            id="supplierOrderId"
            value={formData.supplierOrderId}
            onChange={(e) => handleInputChange('supplierOrderId', e.target.value)}
            placeholder="Supplier's order reference"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="expectedDeliveryDate">Expected Delivery Date</Label>
          <Input
            id="expectedDeliveryDate"
            type="date"
            value={formData.expectedDeliveryDate}
            onChange={(e) => handleInputChange('expectedDeliveryDate', e.target.value)}
            placeholder={getDefaultDeliveryDate()}
            disabled={isLoading}
          />
        </div>

        <div className="md:col-span-2">
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
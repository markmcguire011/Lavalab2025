"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddMaterialFormProps {
  onSubmit: (materialData: MaterialFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface MaterialFormData {
  name: string;
  description: string;
  image_url?: string;
  currentInventory: number;
  unit: string;
  category?: string;
  unitCost?: number;
  supplier?: string;
  sku?: string;
  lowStockThreshold?: number;
}

export function AddMaterialForm({ onSubmit, onCancel, isLoading = false }: AddMaterialFormProps) {
  const [formData, setFormData] = useState<MaterialFormData>({
    name: '',
    description: '',
    image_url: '',
    currentInventory: 0,
    unit: '',
    category: '',
    unitCost: undefined,
    supplier: '',
    sku: '',
    lowStockThreshold: undefined
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create clean data object, removing empty optional fields
    const cleanData: MaterialFormData = {
      name: formData.name,
      description: formData.description,
      currentInventory: formData.currentInventory,
      unit: formData.unit,
      ...(formData.image_url && { image_url: formData.image_url }),
      ...(formData.category && { category: formData.category }),
      ...(formData.unitCost && { unitCost: formData.unitCost }),
      ...(formData.supplier && { supplier: formData.supplier }),
      ...(formData.sku && { sku: formData.sku }),
      ...(formData.lowStockThreshold && { lowStockThreshold: formData.lowStockThreshold })
    };

    onSubmit(cleanData);
  };

  const handleInputChange = (field: keyof MaterialFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="name">Material Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter material name"
            required
            disabled={isLoading}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe the material"
            required
            disabled={isLoading}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="currentInventory">Current Inventory *</Label>
          <Input
            id="currentInventory"
            type="number"
            min="0"
            value={formData.currentInventory}
            onChange={(e) => handleInputChange('currentInventory', parseInt(e.target.value) || 0)}
            placeholder="0"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="unit">Unit *</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => handleInputChange('unit', e.target.value)}
            placeholder="e.g., pieces, kg, meters"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            placeholder="Material category"
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
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => handleInputChange('sku', e.target.value)}
            placeholder="Product SKU"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="unitCost">Unit Cost ($)</Label>
          <Input
            id="unitCost"
            type="number"
            min="0"
            step="0.01"
            value={formData.unitCost || ''}
            onChange={(e) => handleInputChange('unitCost', parseFloat(e.target.value))}
            placeholder="0.00"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
          <Input
            id="lowStockThreshold"
            type="number"
            min="0"
            value={formData.lowStockThreshold || ''}
            onChange={(e) => handleInputChange('lowStockThreshold', parseInt(e.target.value))}
            placeholder="Alert when below this amount"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="image_url">Image URL</Label>
          <Input
            id="image_url"
            type="url"
            value={formData.image_url}
            onChange={(e) => handleInputChange('image_url', e.target.value)}
            placeholder="https://example.com/image.jpg"
            disabled={isLoading}
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
          disabled={isLoading || !formData.name || !formData.description || !formData.unit}
        >
          {isLoading ? 'Adding...' : 'Add Material'}
        </Button>
      </div>
    </form>
  );
}
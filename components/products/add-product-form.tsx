"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddProductFormProps {
  onSubmit: (productData: ProductFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface ProductFormData {
  name: string;
  description?: string;
  category?: string;
  price?: number;
  stockQuantity?: number;
  sku?: string;
  status: 'active' | 'inactive' | 'discontinued';
}

export function AddProductForm({ onSubmit, onCancel, isLoading = false }: AddProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    price: undefined,
    stockQuantity: undefined,
    sku: '',
    status: 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name) {
      return;
    }

    // Create clean data object, removing empty optional fields
    const cleanData: ProductFormData = {
      name: formData.name,
      status: formData.status,
      ...(formData.description && { description: formData.description }),
      ...(formData.category && { category: formData.category }),
      ...(formData.price !== undefined && formData.price > 0 && { price: formData.price }),
      ...(formData.stockQuantity !== undefined && formData.stockQuantity >= 0 && { stockQuantity: formData.stockQuantity }),
      ...(formData.sku && { sku: formData.sku })
    };

    onSubmit(cleanData);
  };

  const handleInputChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter product name"
            required
            disabled={isLoading}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Product description"
            disabled={isLoading}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            type="text"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            placeholder="Product category"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            type="text"
            value={formData.sku}
            onChange={(e) => handleInputChange('sku', e.target.value)}
            placeholder="Product SKU"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price || ''}
            onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || undefined)}
            placeholder="0.00"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="stockQuantity">Stock Quantity</Label>
          <Input
            id="stockQuantity"
            type="number"
            min="0"
            value={formData.stockQuantity || ''}
            onChange={(e) => handleInputChange('stockQuantity', parseInt(e.target.value) || undefined)}
            placeholder="0"
            disabled={isLoading}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value as 'active' | 'inactive' | 'discontinued')}
            disabled={isLoading}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="discontinued">Discontinued</option>
          </select>
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
          disabled={isLoading || !formData.name}
        >
          {isLoading ? 'Creating...' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
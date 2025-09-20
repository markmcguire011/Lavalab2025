"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { Material, transformMaterialFromDb } from "@/lib/types/materials";

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
  imageUrl?: string;
  materialId?: string;
}

export function AddProductForm({ onSubmit, onCancel, isLoading = false }: AddProductFormProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    price: undefined,
    imageUrl: '',
    materialId: ''
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
    if (!formData.name) {
      return;
    }

    // Create clean data object, removing empty optional fields
    const cleanData: ProductFormData = {
      name: formData.name,
      ...(formData.description && { description: formData.description }),
      ...(formData.category && { category: formData.category }),
      ...(formData.price !== undefined && formData.price > 0 && { price: formData.price }),
      ...(formData.imageUrl && { imageUrl: formData.imageUrl }),
      ...(formData.materialId && { materialId: formData.materialId })
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
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={(e) => handleInputChange('imageUrl', e.target.value)}
            placeholder="https://example.com/image.jpg"
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
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              handleInputChange('price', isNaN(value) ? '' : value);
            }}
            placeholder="0.00"
            disabled={isLoading}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="materialId">Material</Label>
          {loadingMaterials ? (
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <select
              id="materialId"
              value={formData.materialId}
              onChange={(e) => handleInputChange('materialId', e.target.value)}
              disabled={isLoading}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a material (optional)</option>
              {materials.map(material => (
                <option key={material.id} value={material.id}>
                  {material.name} {material.supplier ? `(${material.supplier})` : ''}
                </option>
              ))}
            </select>
          )}
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
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { Fulfillment, FulfillmentStatus, generateFulfillmentId } from "@/lib/types/fulfillments";
import { Product } from "@/lib/types/products";

export interface FulfillmentFormData {
  fulfillmentId: string;
  productId: string;
  quantity: number;
  customerEmail: string;
  notes?: string;
  status: FulfillmentStatus;
}

interface AddFulfillmentFormProps {
  onSubmit: (data: FulfillmentFormData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  editingFulfillment?: Fulfillment | null;
}

export function AddFulfillmentForm({ onSubmit, onCancel, isLoading, editingFulfillment }: AddFulfillmentFormProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<FulfillmentFormData>({
    fulfillmentId: generateFulfillmentId(),
    productId: "",
    quantity: 1,
    customerEmail: "",
    notes: "",
    status: "pending"
  });
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (editingFulfillment) {
      setFormData({
        fulfillmentId: editingFulfillment.fulfillmentId,
        productId: editingFulfillment.productId,
        quantity: editingFulfillment.quantity,
        customerEmail: editingFulfillment.customerEmail,
        notes: editingFulfillment.notes || "",
        status: editingFulfillment.status
      });
    }
  }, [editingFulfillment]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.productId) {
      setError("Please select a product");
      return;
    }

    if (!formData.customerEmail) {
      setError("Please enter customer email");
      return;
    }

    if (formData.quantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const statusOptions: { value: FulfillmentStatus; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fulfillmentId">Fulfillment ID</Label>
          <Input
            id="fulfillmentId"
            value={formData.fulfillmentId}
            onChange={(e) => setFormData(prev => ({ ...prev, fulfillmentId: e.target.value }))}
            required
            disabled={!!editingFulfillment}
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as FulfillmentStatus }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            required
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="product">Product</Label>
        <select
          id="product"
          value={formData.productId}
          onChange={(e) => setFormData(prev => ({ ...prev, productId: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          required
        >
          <option value="">Select a product</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="customerEmail">Customer Email</Label>
          <Input
            id="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Any additional notes about this fulfillment..."
          rows={3}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
          {error}
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
          disabled={isLoading}
          className="bg-brand-500 hover:bg-brand-600 text-white"
        >
          {isLoading 
            ? (editingFulfillment ? "Updating..." : "Creating...") 
            : (editingFulfillment ? "Update Fulfillment" : "Create Fulfillment")
          }
        </Button>
      </div>
    </form>
  );
}
import { Product as DatabaseProduct } from '@/lib/types/database';

// Client-side interface for products (what components expect)
export interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  imageUrl?: string;
  materialId?: string;
  materialName?: string; // Populated from join with materials table
  materialImageUrl?: string; // Populated from join with materials table
  createdAt: string;
  updatedAt: string;
}

// Extended product interface with material details
export interface ProductWithMaterial extends Product {
  material?: {
    id: string;
    name: string;
    description: string;
    unit: string;
    category?: string;
    supplier?: string;
  };
}

// Transform database row to client interface
export function transformProductFromDb(dbProduct: DatabaseProduct & { material_name?: string; material_image_url?: string }): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description || undefined,
    category: dbProduct.category || undefined,
    price: dbProduct.price || undefined,
    imageUrl: dbProduct.image_url || undefined,
    materialId: dbProduct.material_id || undefined,
    materialName: dbProduct.material_name,
    materialImageUrl: dbProduct.material_image_url,
    createdAt: dbProduct.created_at || new Date().toISOString(),
    updatedAt: dbProduct.updated_at || new Date().toISOString()
  };
}

// Transform client interface to database insert
export function transformProductForDb(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'materialName'> & { userId: string }): {
  user_id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  price?: number | null;
  image_url?: string | null;
  material_id?: string | null;
} {
  return {
    user_id: product.userId,
    name: product.name,
    description: product.description || null,
    category: product.category || null,
    price: product.price || null,
    image_url: product.imageUrl || null,
    material_id: product.materialId || null
  };
}

// Helper function to format dates for display
export function formatProductDate(dateString?: string): string {
  if (!dateString) return 'Not set';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Helper function to format price for display
export function formatProductPrice(price?: number): string {
  if (price === undefined || price === null) return 'Price not set';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

// Helper function to get effective image URL (product image or fallback to material image)
export function getEffectiveImageUrl(product: Product): string | undefined {
  return product.imageUrl || product.materialImageUrl;
}

// Helper function to get category color for UI
export function getCategoryColor(category?: string): string {
  if (!category) return 'bg-gray-100 text-gray-800';
  
  // Generate consistent colors based on category name
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-yellow-100 text-yellow-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-red-100 text-red-800',
    'bg-orange-100 text-orange-800'
  ];
  
  // Simple hash function to get consistent color for category
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}
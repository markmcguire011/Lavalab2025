import { Material as DatabaseMaterial } from '@/lib/types/database';

// Client-side interface for materials (what components expect)
export interface Material {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  currentInventory: number;
  neededInventory: number;
  unit: string;
  category?: string;
  unitCost?: number;
  supplier?: string;
  sku?: string;
  lowStockThreshold?: number;
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: string;
  updatedAt: string;
}

// Transform database row to client interface
export function transformMaterialFromDb(dbMaterial: DatabaseMaterial): Material {
  return {
    id: dbMaterial.id,
    name: dbMaterial.name,
    description: dbMaterial.description || '',
    image_url: dbMaterial.image_url || undefined,
    currentInventory: dbMaterial.current_inventory,
    neededInventory: dbMaterial.needed_inventory,
    unit: dbMaterial.unit,
    category: dbMaterial.category || undefined,
    unitCost: dbMaterial.unit_cost || undefined,
    supplier: dbMaterial.supplier || undefined,
    sku: dbMaterial.sku || undefined,
    lowStockThreshold: dbMaterial.low_stock_threshold || undefined,
    status: dbMaterial.status,
    createdAt: dbMaterial.created_at,
    updatedAt: dbMaterial.updated_at
  };
}

// Transform client interface to database insert
export function transformMaterialForDb(material: Omit<Material, 'id' | 'createdAt' | 'updatedAt'> & { userId: string }): {
  user_id: string;
  name: string;
  description?: string;
  image_url?: string;
  current_inventory: number;
  needed_inventory: number;
  unit: string;
  category?: string;
  unit_cost?: number;
  supplier?: string;
  sku?: string;
  low_stock_threshold?: number;
  status: 'active' | 'inactive' | 'discontinued';
} {
  return {
    user_id: material.userId,
    name: material.name,
    description: material.description || undefined,
    image_url: material.image_url,
    current_inventory: material.currentInventory,
    needed_inventory: material.neededInventory,
    unit: material.unit,
    category: material.category,
    unit_cost: material.unitCost,
    supplier: material.supplier,
    sku: material.sku,
    low_stock_threshold: material.lowStockThreshold,
    status: material.status
  };
}
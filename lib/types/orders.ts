import { Order as DatabaseOrder } from '@/lib/types/database';

// Client-side interface for orders (what components expect)
export interface Order {
  id: string;
  orderNumber: string;
  materialId: string;
  materialName?: string; // Populated from join with materials table
  quantity: number;
  unitPrice?: number;
  totalAmount?: number;
  supplier?: string;
  supplierOrderId?: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  status: 'ordered' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Extended order interface with material details
export interface OrderWithMaterial extends Order {
  material: {
    id: string;
    name: string;
    description: string;
    unit: string;
    category?: string;
    image_url?: string;
  };
}

// Transform database row to client interface
export function transformOrderFromDb(dbOrder: DatabaseOrder & { material_name?: string }): Order {
  return {
    id: dbOrder.id,
    orderNumber: dbOrder.order_number,
    materialId: dbOrder.material_id,
    materialName: dbOrder.material_name,
    quantity: dbOrder.quantity,
    unitPrice: dbOrder.unit_price || undefined,
    totalAmount: dbOrder.total_amount || undefined,
    supplier: dbOrder.supplier || undefined,
    supplierOrderId: dbOrder.supplier_order_id || undefined,
    expectedDeliveryDate: dbOrder.expected_delivery_date || undefined,
    actualDeliveryDate: dbOrder.actual_delivery_date || undefined,
    status: dbOrder.status,
    notes: dbOrder.notes || undefined,
    createdAt: dbOrder.created_at,
    updatedAt: dbOrder.updated_at
  };
}

// Transform client interface to database insert
export function transformOrderForDb(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber' | 'materialName'> & { userId: string }): {
  user_id: string;
  material_id: string;
  quantity: number;
  unit_price?: number | null;
  total_amount?: number | null;
  supplier?: string | null;
  supplier_order_id?: string | null;
  expected_delivery_date?: string | null;
  actual_delivery_date?: string | null;
  status: 'ordered' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string | null;
} {
  return {
    user_id: order.userId,
    material_id: order.materialId,
    quantity: order.quantity,
    unit_price: order.unitPrice || null,
    total_amount: order.totalAmount || null,
    supplier: order.supplier || null,
    supplier_order_id: order.supplierOrderId || null,
    expected_delivery_date: order.expectedDeliveryDate || null,
    actual_delivery_date: order.actualDeliveryDate || null,
    status: order.status,
    notes: order.notes || null
  };
}

// Helper function to format dates for display
export function formatOrderDate(dateString?: string): string {
  if (!dateString) return 'Not set';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Helper function to calculate days until delivery
export function getDaysUntilDelivery(expectedDeliveryDate?: string): number | null {
  if (!expectedDeliveryDate) return null;
  
  const deliveryDate = new Date(expectedDeliveryDate);
  const today = new Date();
  const diffTime = deliveryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// Helper function to get status color for UI
export function getOrderStatusColor(status: Order['status']): string {
  const statusColors = {
    ordered: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  
  return statusColors[status];
}

// Helper function to check if order can be cancelled
export function canCancelOrder(status: Order['status']): boolean {
  return !['delivered', 'cancelled'].includes(status);
}

// Helper function to check if order can be edited
export function canEditOrder(status: Order['status']): boolean {
  return !['delivered', 'cancelled', 'shipped'].includes(status);
}
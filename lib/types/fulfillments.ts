import { Fulfillment as DatabaseFulfillment } from '@/lib/types/database';

// Status types for fulfillments
export type FulfillmentStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Client-side interface for fulfillments (what components expect)
export interface Fulfillment {
  id: string;
  fulfillmentId: string;
  productId: string;
  productName?: string; // Populated from join with products table
  productImageUrl?: string; // Populated from join with products table
  quantity: number;
  customerEmail: string;
  notes?: string;
  status: FulfillmentStatus;
  createdAt: string;
  updatedAt: string;
}

// Extended fulfillment interface with product details
export interface FulfillmentWithProduct extends Fulfillment {
  product?: {
    id: string;
    name: string;
    description?: string;
    category?: string;
    price?: number;
    imageUrl?: string;
    materialName?: string;
  };
}

// Transform database row to client interface
export function transformFulfillmentFromDb(
  dbFulfillment: DatabaseFulfillment & { 
    product_name?: string; 
    product_image_url?: string;
  }
): Fulfillment {
  return {
    id: dbFulfillment.id,
    fulfillmentId: dbFulfillment.fulfillment_id,
    productId: dbFulfillment.product_id,
    productName: dbFulfillment.product_name,
    productImageUrl: dbFulfillment.product_image_url,
    quantity: dbFulfillment.quantity,
    customerEmail: dbFulfillment.customer_email,
    notes: dbFulfillment.notes || undefined,
    status: dbFulfillment.status as FulfillmentStatus,
    createdAt: dbFulfillment.created_at || new Date().toISOString(),
    updatedAt: dbFulfillment.updated_at || new Date().toISOString()
  };
}

// Transform client interface to database insert
export function transformFulfillmentForDb(
  fulfillment: Omit<Fulfillment, 'id' | 'createdAt' | 'updatedAt' | 'productName' | 'productImageUrl'> & { userId: string }
): {
  fulfillment_id: string;
  product_id: string;
  quantity: number;
  customer_email: string;
  notes?: string | null;
  status: string;
  user_id: string;
} {
  return {
    fulfillment_id: fulfillment.fulfillmentId,
    product_id: fulfillment.productId,
    quantity: fulfillment.quantity,
    customer_email: fulfillment.customerEmail,
    notes: fulfillment.notes || null,
    status: fulfillment.status,
    user_id: fulfillment.userId
  };
}

// Helper function to format dates for display
export function formatFulfillmentDate(dateString?: string): string {
  if (!dateString) return 'Not set';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Helper function to get status color for UI
export function getFulfillmentStatusColor(status: FulfillmentStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Helper function to get human-readable status text
export function getFulfillmentStatusText(status: FulfillmentStatus): string {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'processing':
      return 'Processing';
    case 'shipped':
      return 'Shipped';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}

// Helper function to determine if fulfillment can be edited
export function canEditFulfillment(status: FulfillmentStatus): boolean {
  return status === 'pending' || status === 'processing';
}

// Helper function to determine if fulfillment can be cancelled
export function canCancelFulfillment(status: FulfillmentStatus): boolean {
  return status === 'pending' || status === 'processing';
}

// Helper function to get next valid statuses for a fulfillment
export function getNextValidStatuses(currentStatus: FulfillmentStatus): FulfillmentStatus[] {
  switch (currentStatus) {
    case 'pending':
      return ['processing', 'cancelled'];
    case 'processing':
      return ['shipped', 'cancelled'];
    case 'shipped':
      return ['delivered'];
    case 'delivered':
      return []; // Final state
    case 'cancelled':
      return []; // Final state
    default:
      return [];
  }
}

// Generate a unique fulfillment ID
export function generateFulfillmentId(): string {
  const prefix = 'FL';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}
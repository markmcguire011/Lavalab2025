import { Order, formatOrderDate, getOrderStatusColor, canCancelOrder, canEditOrder } from "@/lib/types/orders";

interface OrderRowProps {
  order: Order;
  onEdit?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export function OrderRow({ order, onEdit, onCancel }: OrderRowProps) {
  const statusColor = getOrderStatusColor(order.status);
  const canEdit = canEditOrder(order.status);
  const canCancel = canCancelOrder(order.status);

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center">
            <span className="text-xs text-gray-600 font-mono">#{order.orderNumber.slice(-3)}</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{order.materialName || 'Unknown Material'}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
            <span>Qty: {order.quantity}</span>
            <span>•</span>
            <span>{order.supplier || 'No supplier'}</span>
            <span>•</span>
            <span>Due: {formatOrderDate(order.expectedDeliveryDate)}</span>
          </div>
          {order.totalAmount && (
            <div className="text-sm text-gray-500 mt-1">
              Total: ${order.totalAmount.toFixed(2)}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
        
        <div className="flex gap-2">
          {onEdit && canEdit && (
            <button
              onClick={() => onEdit(order.id)}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
            >
              Edit
            </button>
          )}
          {onCancel && canCancel && (
            <button
              onClick={() => onCancel(order.id)}
              className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
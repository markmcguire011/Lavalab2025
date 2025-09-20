interface Order {
  id: string;
  material: string;
  quantity: string;
  supplier: string;
  expectedDelivery: string;
  status: 'ordered' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

interface OrderRowProps {
  order: Order;
  onEdit?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const statusStyles = {
  ordered: "bg-blue-100 text-blue-800",
  processing: "bg-yellow-100 text-yellow-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

const statusLabels = {
  ordered: "Ordered",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled"
};

export function OrderRow({ order, onEdit, onCancel }: OrderRowProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center">
            <span className="text-xs text-gray-600 font-mono">#{order.id.slice(-3)}</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{order.material}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
            <span>Qty: {order.quantity}</span>
            <span>•</span>
            <span>{order.supplier}</span>
            <span>•</span>
            <span>Due: {order.expectedDelivery}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[order.status]}`}>
          {statusLabels[order.status]}
        </span>
        
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(order.id)}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
            >
              Edit
            </button>
          )}
          {onCancel && order.status !== 'cancelled' && order.status !== 'delivered' && (
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
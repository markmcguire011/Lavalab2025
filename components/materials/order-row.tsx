import { Order, getOrderStatusColor, canCancelOrder, canEditOrder } from "@/lib/types/orders";
import { Pencil, X } from "lucide-react";
import Image from "next/image";

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
    <div className="flex items-center justify-between p-4 rounded-lg bg-white">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 border border-gray-200 border-2 rounded-lg flex items-center justify-center">
          {order.materialImageUrl ? (
            <Image 
              src={order.materialImageUrl} 
              alt={order.materialName || 'Material'} 
              width={32} 
              height={32}
              className="w-8 h-8 object-cover rounded"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center">
              <span className="text-xs text-gray-600 font-mono">#{order.orderNumber.slice(-3)}</span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{order.materialName || 'Unknown Material'}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <span>{order.supplier || 'No supplier'}</span>
            <span>|</span>
            <span>Qty: {order.quantity}</span>
            <span>|</span>
            {order.totalAmount && (<span>Total: ${order.totalAmount.toFixed(2)}</span>)}
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 border rounded-md">
        <div className="flex h-auto w-auto">
          {onEdit && canEdit && (
            <button
              onClick={() => onEdit(order.id)}
              className="text-xs font-medium text-gray-500 hover:text-gray-700 p-4 hover:bg-gray-100 border-r"
            >
              <Pencil className="text-gray-500 w-4 h-4 self-center" />
            </button>
          )}
          {onCancel && canCancel && (
            <button
              onClick={() => onCancel(order.id)}
              className="text-xs font-medium text-red-500 hover:text-red-700 p-4 hover:bg-red-50"
            >
              <X className="text-red-500 w-4 h-4 self-center" />
            </button>
          )}
        </div>
      </div>
      
    </div>
  );
}
import { Fulfillment, getFulfillmentStatusColor, canCancelFulfillment, canEditFulfillment } from "@/lib/types/fulfillments";
import { Pencil, X } from "lucide-react";
import Image from "next/image";

interface FulfillmentRowProps {
  fulfillment: Fulfillment;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function FulfillmentRow({ fulfillment, onEdit, onDelete }: FulfillmentRowProps) {
  const statusColor = getFulfillmentStatusColor(fulfillment.status);
  const canEdit = canEditFulfillment(fulfillment.status);
  const canDelete = true; // Allow deletion of any fulfillment

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-white">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 border border-gray-200 border-2 rounded-lg flex items-center justify-center">
          {fulfillment.productImageUrl ? (
            <Image 
              src={fulfillment.productImageUrl} 
              alt={fulfillment.productName || 'Product'} 
              width={32} 
              height={32}
              className="w-8 h-8 object-cover rounded"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center">
              <span className="text-xs text-gray-600 font-mono">#{fulfillment.fulfillmentId.slice(-3)}</span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-medium text-gray-900">{fulfillment.productName || 'Unknown Product'}</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {fulfillment.status}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>ID: {fulfillment.fulfillmentId}</span>
            <span>|</span>
            <span>{fulfillment.customerEmail}</span>
            <span>|</span>
            <span>Qty: {fulfillment.quantity}</span>
            {fulfillment.notes && (
              <>
                <span>|</span>
                <span className="truncate max-w-32" title={fulfillment.notes}>
                  {fulfillment.notes}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 border rounded-md">
        <div className="flex h-auto w-auto">
          {onEdit && canEdit && (
            <button
              onClick={() => onEdit(fulfillment.id)}
              className="text-xs font-medium text-gray-500 hover:text-gray-700 p-4 hover:bg-gray-100 border-r"
            >
              <Pencil className="text-gray-500 w-4 h-4 self-center" />
            </button>
          )}
          {onDelete && canDelete && (
            <button
              onClick={() => onDelete(fulfillment.id)}
              className="text-xs font-medium text-red-500 hover:text-red-700 p-4 hover:bg-red-50"
              title="Delete fulfillment"
            >
              <X className="text-red-500 w-4 h-4 self-center" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
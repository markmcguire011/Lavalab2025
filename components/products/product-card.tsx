import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  imageUrl?: string;
  status: 'active' | 'inactive' | 'discontinued';
  stockQuantity?: number;
  sku?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductCardProps {
  product: Product;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'discontinued':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-4xl font-light">
              {product.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
            {product.sku && (
              <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
            )}
          </div>
          
          {/* Status Badge */}
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
            {product.status}
          </span>
        </div>

        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        )}

        <div className="space-y-2 mb-4">
          {product.category && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Category:</span>
              <span className="text-gray-900">{product.category}</span>
            </div>
          )}
          {product.price !== undefined && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Price:</span>
              <span className="text-gray-900 font-medium">${product.price.toFixed(2)}</span>
            </div>
          )}
          {product.stockQuantity !== undefined && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Stock:</span>
              <span className="text-gray-900">{product.stockQuantity}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 border-t pt-3">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(product.id)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(product.id)}
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
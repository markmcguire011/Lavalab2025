import { Pencil, X } from "lucide-react";
import { Product, getCategoryColor, formatProductPrice } from "@/lib/types/products";

interface ProductCardProps {
  product: Product;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {

  return (
    <div className="flex flex-col bg-white rounded-md max-h-full border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
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
      <div className="flex flex-col p-4 h-full">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
          </div>
        </div>

        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-10">{product.description}</p>
        )}

        <div className="space-y-2 mb-4">
          {product.category && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Category:</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                {product.category}
              </span>
            </div>
          )}
          {product.price !== undefined && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Price:</span>
              <span className="text-gray-900 font-medium">{formatProductPrice(product.price)}</span>
            </div>
          )}
          {product.materialName && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Material:</span>
              <span className="text-gray-900">{product.materialName}</span>
            </div>
          )}
        </div>
        <div className="grow" />
        {/* Action Buttons */}
        <div className="flex border rounded w-min self-end">
          {onEdit && (
            <button
              onClick={() => onEdit(product.id)}
              className="p-2 hover:bg-gray-50 transition-colors border-r"
            >
              <Pencil className="h-4 w-4 self-center" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(product.id)}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4 self-center" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
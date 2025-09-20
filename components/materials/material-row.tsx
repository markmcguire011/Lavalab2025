import { InventoryAdder } from "@/components/materials/inventory-adder";
import { Material } from "@/lib/types/materials";
import { Pencil } from "lucide-react";
import Image from "next/image";

interface MaterialRowProps {
  material: Material;
  onAdd: (id: string) => void;
  onSubtract: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function MaterialRow({ material, onAdd, onSubtract, onEdit }: MaterialRowProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-white">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 border border-gray-200 border-2 rounded-lg flex items-center justify-center">
          {material.image_url ? (
            <Image 
              src={material.image_url} 
              alt={material.name}
              width={32}
              height={32}
              className="p-1 object-cover rounded"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{material.name}</h3>
          <p className="text-sm text-gray-500">{material.description}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {onEdit && (
          <button
            onClick={() => onEdit(material.id)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="Edit material"
          >
            <Pencil className="h-4 w-4" />
          </button>
        )}
        <InventoryAdder
          currentInventory={material.currentInventory}
          neededInventory={material.neededInventory}
          unit={material.unit}
          onAdd={() => onAdd(material.id)}
          onSubtract={() => onSubtract(material.id)}
        />
      </div>
    </div>
  );
}
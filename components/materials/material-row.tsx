import { InventoryAdder } from "./inventory-adder";
import { Material } from "@/lib/types/materials";

interface MaterialRowProps {
  material: Material;
  onAdd: (id: string) => void;
  onSubtract: (id: string) => void;
}

export function MaterialRow({ material, onAdd, onSubtract }: MaterialRowProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-white">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
          {material.image_url ? (
            <img 
              src={material.image_url} 
              alt={material.name}
              className="w-10 h-10 object-cover rounded"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{material.name}</h3>
          <p className="text-sm text-gray-500">{material.description}</p>
          {/* {material.category && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
              {material.category}
            </span>
          )} */}
        </div>
      </div>
      
      <InventoryAdder
        currentInventory={material.currentInventory}
        neededInventory={material.neededInventory}
        unit={material.unit}
        onAdd={() => onAdd(material.id)}
        onSubtract={() => onSubtract(material.id)}
      />
    </div>
  );
}
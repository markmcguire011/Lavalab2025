"use client";

import { Plus, Minus } from "lucide-react";

interface InventoryAdderProps {
  currentInventory: number;
  neededInventory: number;
  unit: string;
  onAdd: () => void;
  onSubtract: () => void;
}

export function InventoryAdder({ currentInventory, neededInventory, unit, onAdd, onSubtract }: InventoryAdderProps) {
  return (
    <div className="flex bg-white border">
      <button 
        onClick={onSubtract}
        className="hover:bg-gray-50 transition-colors p-2"
      >
        <Minus className="text-gray-600 self-center" />
      </button>
      
      <div className={`text-center min-w-[95px] h-full outline outline-1 outline-gray-200 z-10 ${
          neededInventory > currentInventory 
            ? "outline-[#ca8a04]" 
            : "text-gray-500"
        }`}>
        <div className={`text-lg py-0.5 font-normal text-gray-900 border-b ${
          neededInventory > currentInventory 
            ? "bg-yellow-50 border-b-yellow-600" 
            : "text-gray-500"
        }`}>
          {currentInventory}
        </div>
        <div className={`text-xs uppercase h-full bg-gray-100 ${
          neededInventory > currentInventory 
            ? "bg-yellow-600 text-white" 
            : "text-gray-500"
        }`}>
          {neededInventory} {unit}
        </div>
      </div>
      
      <button 
        onClick={onAdd}
        className="hover:bg-gray-50 transition-colors p-2"
      >
        <Plus className="text-gray-600 self-center" />
      </button>
    </div>
  );
}
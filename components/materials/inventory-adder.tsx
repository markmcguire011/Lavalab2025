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
    <div className="flex items-center overflow-hidden bg-white">
      <button 
        onClick={onSubtract}
        className="min-h-full rounded-md hover:bg-gray-50 transition-colors border-l border-t border-b"
      >
        <Minus className="text-gray-600 self-center" />
      </button>
      
      <div className={`text-center min-w-[95px] h-full border ${
          neededInventory > currentInventory 
            ? "border-yellow-600" 
            : "text-gray-500"
        }`}>
        <div className={`text-lg font-normal text-gray-900 border-b ${
          neededInventory > currentInventory 
            ? "bg-yellow-50 border-b-yellow-600" 
            : "text-gray-500"
        }`}>
          {currentInventory}
        </div>
        <div className={`text-xs uppercase h-full ${
          neededInventory > currentInventory 
            ? "bg-yellow-600 text-white" 
            : "text-gray-500"
        }`}>
          {neededInventory} {unit}
        </div>
      </div>
      
      <button 
        onClick={onAdd}
        className="flex hover:bg-gray-50 transition-colors items-center justify-center p-2"
      >
        <Plus className="text-gray-600 self-center" />
      </button>
    </div>
  );
}
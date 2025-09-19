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
    <div className="flex items-center border rounded-lg overflow-hidden bg-white">
      <button 
        onClick={onSubtract}
        className="flex hover:bg-gray-50 border-r transition-colors h-12 w-12 items-center justify-center p-2"
      >
        <Minus className="text-gray-600 self-center" />
      </button>
      
      <div className="text-center min-w-[80px] h-full">
        <div className="text-lg font-semibold text-gray-900 border-b">
          {currentInventory}
        </div>
        <div className={`text-xs uppercase h-full ${
          neededInventory > currentInventory 
            ? "bg-yellow-200 text-yellow-800" 
            : "text-gray-500"
        }`}>
          {neededInventory} {unit}
        </div>
      </div>
      
      <button 
        onClick={onAdd}
        className="flex hover:bg-gray-50 border-l transition-colors h-12 w-12 items-center justify-center p-2"
      >
        <Plus className="text-gray-600 self-center" />
      </button>
    </div>
  );
}
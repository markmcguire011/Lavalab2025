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
        className="p-3 hover:bg-gray-50 border-r transition-colors"
      >
        <Minus className="h-4 w-4 text-gray-600" />
      </button>
      
      <div className="px-6 py-3 text-center min-w-[80px]">
        <div className="text-lg font-semibold text-gray-900">
          {currentInventory}
        </div>
        <div className={`text-xs uppercase px-2 py-1 rounded ${
          neededInventory > currentInventory 
            ? "bg-yellow-200 text-yellow-800" 
            : "text-gray-500"
        }`}>
          {neededInventory} {unit}
        </div>
      </div>
      
      <button 
        onClick={onAdd}
        className="p-3 hover:bg-gray-50 border-l transition-colors"
      >
        <Plus className="h-4 w-4 text-gray-600" />
      </button>
    </div>
  );
}
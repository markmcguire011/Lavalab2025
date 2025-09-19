"use client";

import { Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InventoryAdder } from "./inventory-adder";

export function InventoryTable() {
  const materials = [
    {
      id: 1,
      name: "Cotton T-Shirt Blanks",
      description: "High-quality cotton blanks for screen printing and embroidery",
      image: "/images/cotton-tshirt.jpg",
      currentInventory: 250,
      neededInventory: 300,
      unit: "PCS"
    },
    {
      id: 2,
      name: "Vinyl Stickers",
      description: "Premium adhesive vinyl sheets for cutting and application",
      image: "/images/vinyl-stickers.jpg",
      currentInventory: 1200,
      neededInventory: 500,
      unit: "SHEETS"
    },
    {
      id: 3,
      name: "Embroidery Thread",
      description: "Polyester embroidery thread in various colors",
      image: "/images/embroidery-thread.jpg",
      currentInventory: 45,
      neededInventory: 24,
      unit: "SPOOLS"
    }
  ];

  const handleAdd = (id: number) => {
    console.log(`Adding to material ${id}`);
  };

  const handleSubtract = (id: number) => {
    console.log(`Subtracting from material ${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search materials..." 
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <Button className="bg-brand-500 hover:bg-brand-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>

      <div className="space-y-4">
        {materials.map((material) => (
          <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{material.name}</h3>
                <p className="text-sm text-gray-500">{material.description}</p>
              </div>
            </div>
            
            <InventoryAdder
              currentInventory={material.currentInventory}
              neededInventory={material.neededInventory}
              unit={material.unit}
              onAdd={() => handleAdd(material.id)}
              onSubtract={() => handleSubtract(material.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InventoryAdder } from "./inventory-adder";
import { createClient } from "@/lib/supabase/client";
import { Material, transformMaterialFromDb } from "@/lib/types/materials";

export function InventoryTable() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;

      const transformedMaterials = data?.map(transformMaterialFromDb) || [];
      setMaterials(transformedMaterials);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (id: string) => {
    try {
      const material = materials.find(m => m.id === id);
      if (!material) return;

      const { error } = await (supabase as any)
        .from('materials')
        .update({
          current_inventory: material.currentInventory + 1
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setMaterials(prev => prev.map(m => 
        m.id === id 
          ? { ...m, currentInventory: m.currentInventory + 1 }
          : m
      ));
    } catch (err) {
      console.error('Error adding inventory:', err);
    }
  };

  const handleSubtract = async (id: string) => {
    try {
      const material = materials.find(m => m.id === id);
      if (!material || material.currentInventory <= 0) return;

      const { error } = await (supabase as any)
        .from('materials')
        .update({
          current_inventory: material.currentInventory - 1
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setMaterials(prev => prev.map(m => 
        m.id === id 
          ? { ...m, currentInventory: m.currentInventory - 1 }
          : m
      ));
    } catch (err) {
      console.error('Error subtracting inventory:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search materials..." 
                className="pl-10 w-80"
                disabled
              />
            </div>
            <Button variant="outline" size="sm" disabled>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          <Button className="bg-brand-500 hover:bg-brand-600 text-white" disabled>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-48"></div>
                </div>
              </div>
              <div className="w-32 h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading materials: {error}</p>
        <Button onClick={fetchMaterials} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

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
        {materials.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No materials found</p>
            <Button className="mt-4 bg-brand-500 hover:bg-brand-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Material
            </Button>
          </div>
        ) : (
          materials.map((material) => (
            <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
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
                  {material.category && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                      {material.category}
                    </span>
                  )}
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
          ))
        )}
      </div>
    </div>
  );
}
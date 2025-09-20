"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MaterialsHeader } from "@/components/materials/materials-header";
import { MaterialRow } from "@/components/materials/material-row";
import { AddMaterialModal } from "@/components/materials/add-material-modal";
import { createClient } from "@/lib/supabase/client";
import { Material, transformMaterialFromDb, transformMaterialForDb } from "@/lib/types/materials";
import { MaterialFormData } from "@/components/materials/add-material-form";
import { Input } from "@/components/ui/input";

export function InventoryTable() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
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

  // Handler functions for the header components
  const handleClearFilters = () => {
    setCategoryFilter("all");
    setStockFilter("all");
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleAddMaterial = async (materialData: MaterialFormData) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Transform the form data for database insertion
      const dbMaterial = transformMaterialForDb({
        ...materialData,
        neededInventory: 0, // Set to 0 as specified - will be determined by orders
        status: 'active' as const,
        userId: user.id
      });

      const { data, error } = await (supabase as any)
        .from('materials')
        .insert([dbMaterial])
        .select()
        .single();

      if (error) throw error;

      // Transform back and add to local state
      const newMaterial = transformMaterialFromDb(data);
      setMaterials(prev => [...prev, newMaterial]);
    } catch (err) {
      console.error('Error adding material:', err);
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const handleUpdateMaterial = async (materialData: MaterialFormData) => {
    if (!editingMaterial) return;

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Transform the form data for database update, preserving existing values
      const dbMaterial = transformMaterialForDb({
        ...materialData,
        currentInventory: editingMaterial.currentInventory, // Preserve current inventory
        neededInventory: editingMaterial.neededInventory, // Preserve needed inventory
        status: editingMaterial.status, // Preserve status
        userId: user.id
      });

      const { data, error } = await (supabase as any)
        .from('materials')
        .update(dbMaterial)
        .eq('id', editingMaterial.id)
        .select()
        .single();

      if (error) throw error;

      // Transform back and update local state
      const updatedMaterial = transformMaterialFromDb(data);
      setMaterials(prev => prev.map(m => m.id === editingMaterial.id ? updatedMaterial : m));
      setEditingMaterial(null);
    } catch (err) {
      console.error('Error updating material:', err);
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const handleEdit = (id: string) => {
    const material = materials.find(m => m.id === id);
    if (material) {
      setEditingMaterial(material);
    }
  };

  // Get unique categories for filter dropdown
  const uniqueCategories = Array.from(new Set(materials.map(m => m.category).filter(Boolean))) as string[];

  // Filter materials based on search term, category, and stock status
  const filteredMaterials = materials.filter(material => {
    // Search filter
    const matchesSearch = !searchTerm || 
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (material.category && material.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (material.supplier && material.supplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (material.sku && material.sku.toLowerCase().includes(searchTerm.toLowerCase()));

    // Category filter
    const matchesCategory = categoryFilter === "all" || material.category === categoryFilter;

    // Stock filter
    const matchesStock = stockFilter === "all" || 
      (stockFilter === "low" && material.currentInventory < material.neededInventory) ||
      (stockFilter === "sufficient" && material.currentInventory >= material.neededInventory) ||
      (stockFilter === "zero" && material.currentInventory === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  if (loading) {
    return (
      <div className="space-y-4 px-4 pt-4">
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
    <div className="space-y-4">
      <MaterialsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        stockFilter={stockFilter}
        onStockChange={setStockFilter}
        categories={uniqueCategories}
        onClearFilters={handleClearFilters}
        onAddNew={handleAddNew}
      />

      <div className="space-y-4">
        {filteredMaterials.length === 0 ? (
          <div className="text-center py-8">
            {materials.length === 0 ? (
              <>
                <p className="text-gray-500">No materials found</p>
                <Button 
                  className="mt-4 bg-brand-500 hover:bg-brand-600 text-white"
                  onClick={handleAddNew}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Material
                </Button>
              </>
            ) : (
              <>
                <p className="text-gray-500">No materials match your search</p>
                <Button 
                  onClick={() => setSearchTerm("")}
                  variant="outline" 
                  className="mt-4"
                >
                  Clear Search
                </Button>
              </>
            )}
          </div>
        ) : (
          filteredMaterials.map((material) => (
            <MaterialRow
              key={material.id}
              material={material}
              onAdd={handleAdd}
              onSubtract={handleSubtract}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      <AddMaterialModal
        isOpen={showAddModal || !!editingMaterial}
        onClose={() => {
          setShowAddModal(false);
          setEditingMaterial(null);
        }}
        onSubmit={editingMaterial ? handleUpdateMaterial : handleAddMaterial}
        editingMaterial={editingMaterial}
      />
    </div>
  );
}
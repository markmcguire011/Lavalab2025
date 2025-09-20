"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FulfillmentsHeader } from "@/components/fulfillments/fulfillments-header";
import { FulfillmentRow } from "@/components/fulfillments/fulfillment-row";
import { AddFulfillmentModal } from "@/components/fulfillments/add-fulfillment-modal";
import { createClient } from "@/lib/supabase/client";
import { Fulfillment, transformFulfillmentFromDb, transformFulfillmentForDb } from "@/lib/types/fulfillments";
import { FulfillmentFormData } from "@/components/fulfillments/add-fulfillment-form";

export function FulfillmentsTable() {
  const [fulfillments, setFulfillments] = useState<Fulfillment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFulfillment, setEditingFulfillment] = useState<Fulfillment | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchFulfillments();
  }, []);

  const fetchFulfillments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fulfillments')
        .select(`
          *,
          products(
            id,
            name,
            description,
            category,
            price,
            image_url,
            material_id,
            materials(
              name,
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedFulfillments = data?.map((fulfillmentData: any) => {
        return transformFulfillmentFromDb({
          ...fulfillmentData,
          product_name: fulfillmentData.products?.name,
          product_image_url: fulfillmentData.products?.image_url || fulfillmentData.products?.materials?.image_url
        });
      }) || [];
      
      setFulfillments(transformedFulfillments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching fulfillments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handler functions
  const handleClearFilters = () => {
    setStatusFilter("all");
    setCustomerFilter("all");
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleAddFulfillment = async (fulfillmentData: FulfillmentFormData) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Transform the form data for database insertion
      const dbFulfillment = transformFulfillmentForDb({
        ...fulfillmentData,
        userId: user.id
      });

      const { data, error } = await (supabase as any)
        .from('fulfillments')
        .insert([dbFulfillment])
        .select(`
          *,
          products(
            id,
            name,
            description,
            category,
            price,
            image_url,
            material_id,
            materials(
              name,
              image_url
            )
          )
        `)
        .single();

      if (error) throw error;

      // Update material needed inventory if product has an associated material
      if (data.products?.material_id) {
        await updateMaterialNeededInventory(data.products.material_id, fulfillmentData.quantity);
      }

      // Transform back and add to local state
      const newFulfillment = transformFulfillmentFromDb({
        ...data,
        product_name: data.products?.name,
        product_image_url: data.products?.image_url || data.products?.materials?.image_url
      });
      
      setFulfillments(prev => [newFulfillment, ...prev]);
    } catch (err) {
      console.error('Error creating fulfillment:', err);
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const updateMaterialNeededInventory = async (materialId: string, quantityChange: number) => {
    try {
      // Get current material data
      const { data: material, error: fetchError } = await supabase
        .from('materials')
        .select('needed_inventory')
        .eq('id', materialId)
        .single();

      if (fetchError) throw fetchError;

      // Update needed inventory
      const newNeededInventory = (material.needed_inventory || 0) + quantityChange;
      
      const { error: updateError } = await (supabase as any)
        .from('materials')
        .update({ needed_inventory: Math.max(0, newNeededInventory) })
        .eq('id', materialId);

      if (updateError) throw updateError;
    } catch (err) {
      console.error('Error updating material needed inventory:', err);
      // Don't throw here to avoid breaking the main fulfillment operation
    }
  };

  const handleUpdateFulfillment = async (fulfillmentData: FulfillmentFormData) => {
    if (!editingFulfillment) return;

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Calculate quantity difference for inventory update
      const quantityDifference = fulfillmentData.quantity - editingFulfillment.quantity;

      // Transform the form data for database update
      const dbFulfillment = transformFulfillmentForDb({
        ...fulfillmentData,
        userId: user.id
      });

      const { data, error } = await (supabase as any)
        .from('fulfillments')
        .update(dbFulfillment)
        .eq('id', editingFulfillment.id)
        .select(`
          *,
          products(
            id,
            name,
            description,
            category,
            price,
            image_url,
            material_id,
            materials(
              name,
              image_url
            )
          )
        `)
        .single();

      if (error) throw error;

      // Update material needed inventory if product has an associated material and quantity changed
      if (data.products?.material_id && quantityDifference !== 0) {
        await updateMaterialNeededInventory(data.products.material_id, quantityDifference);
      }

      // Transform back and update local state
      const updatedFulfillment = transformFulfillmentFromDb({
        ...data,
        product_name: data.products?.name,
        product_image_url: data.products?.image_url || data.products?.materials?.image_url
      });
      
      setFulfillments(prev => prev.map(f => f.id === editingFulfillment.id ? updatedFulfillment : f));
      setEditingFulfillment(null);
    } catch (err) {
      console.error('Error updating fulfillment:', err);
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const handleEdit = (id: string) => {
    const fulfillment = fulfillments.find(f => f.id === id);
    if (fulfillment) {
      setEditingFulfillment(fulfillment);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Find the fulfillment to get its details before deleting
      const fulfillmentToDelete = fulfillments.find(f => f.id === id);
      if (!fulfillmentToDelete) {
        throw new Error('Fulfillment not found');
      }

      // Get the product and material information
      const { data: fulfillmentData, error: fetchError } = await supabase
        .from('fulfillments')
        .select(`
          *,
          products(
            material_id
          )
        `)
        .eq('id', id)
        .single() as { data: any; error: any };

      if (fetchError) throw fetchError;

      // Delete the fulfillment
      const { error } = await supabase
        .from('fulfillments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Reduce material needed inventory if product has an associated material
      if (fulfillmentData.products?.material_id) {
        await updateMaterialNeededInventory(fulfillmentData.products.material_id, -fulfillmentToDelete.quantity);
      }

      // Remove from local state
      setFulfillments(prev => prev.filter(fulfillment => fulfillment.id !== id));
    } catch (err) {
      console.error('Error deleting fulfillment:', err);
      // Re-fetch fulfillments to ensure UI is in sync if deletion failed
      fetchFulfillments();
    }
  };

  // Get unique customers for filter dropdown
  const uniqueCustomers = Array.from(new Set(fulfillments.map(f => f.customerEmail).filter(Boolean))) as string[];

  // Filter fulfillments based on search term, status, and customer
  const filteredFulfillments = fulfillments.filter(fulfillment => {
    // Search filter
    const matchesSearch = !searchTerm || 
      fulfillment.fulfillmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fulfillment.productName && fulfillment.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      fulfillment.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fulfillment.notes && fulfillment.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    const matchesStatus = statusFilter === "all" || fulfillment.status === statusFilter;

    // Customer filter
    const matchesCustomer = customerFilter === "all" || fulfillment.customerEmail === customerFilter;

    return matchesSearch && matchesStatus && matchesCustomer;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <FulfillmentsHeader
          searchTerm=""
          onSearchChange={() => {}}
          showFilters={false}
          onToggleFilters={() => {}}
          statusFilter="all"
          onStatusChange={() => {}}
          customerFilter="all"
          onCustomerChange={() => {}}
          customers={[]}
          onClearFilters={() => {}}
          onAddNew={() => {}}
        />
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
              <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading fulfillments: {error}</p>
        <Button onClick={fetchFulfillments} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FulfillmentsHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        customerFilter={customerFilter}
        onCustomerChange={setCustomerFilter}
        customers={uniqueCustomers}
        onClearFilters={handleClearFilters}
        onAddNew={handleAddNew}
      />

      <div className="space-y-4">
        {filteredFulfillments.length === 0 ? (
          <div className="text-center py-8">
            {fulfillments.length === 0 ? (
              <>
                <p className="text-gray-500">No fulfillments found</p>
                <Button 
                  className="mt-4 bg-brand-500 hover:bg-brand-600 text-white"
                  onClick={handleAddNew}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Fulfillment
                </Button>
              </>
            ) : (
              <>
                <p className="text-gray-500">No fulfillments match your search</p>
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
          filteredFulfillments.map((fulfillment) => (
            <FulfillmentRow
              key={fulfillment.id}
              fulfillment={fulfillment}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <AddFulfillmentModal
        isOpen={showAddModal || !!editingFulfillment}
        onClose={() => {
          setShowAddModal(false);
          setEditingFulfillment(null);
        }}
        onSubmit={editingFulfillment ? handleUpdateFulfillment : handleAddFulfillment}
        editingFulfillment={editingFulfillment}
      />
    </div>
  );
}
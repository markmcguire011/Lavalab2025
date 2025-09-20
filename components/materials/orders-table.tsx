"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrdersHeader } from "@/components/materials/orders-header";
import { OrderRow } from "@/components/materials/order-row";
import { SuggestedOrders } from "@/components/materials/suggested-orders";
import { AddOrderModal } from "@/components/materials/add-order-modal";
import { createClient } from "@/lib/supabase/client";
import { Order, transformOrderForDb, transformOrderWithMaterialFromDb } from "@/lib/types/orders";
import { OrderFormData } from "@/components/materials/add-order-form";

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [supplierFilter, setSupplierFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          materials(
            id,
            name,
            description,
            unit,
            category,
            supplier,
            image_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedOrders = data?.map((orderData: any) => {
        // Use the enhanced transformation that handles material joins
        return transformOrderWithMaterialFromDb(orderData);
      }) || [];
      
      setOrders(transformedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handler functions
  const handleClearFilters = () => {
    setStatusFilter("all");
    setSupplierFilter("all");
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleAddOrder = async (orderData: OrderFormData) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Get selected material to auto-populate fields
      const { data: materialData, error: materialError } = await supabase
        .from('materials')
        .select('*')
        .eq('id', orderData.materialId)
        .single();

      if (materialError) throw materialError;

      // Get default delivery date (14 days from now)
      const expectedDelivery = new Date();
      expectedDelivery.setDate(expectedDelivery.getDate() + 14);

      // Calculate unit price and total from material data
      const unitPrice = (materialData as any)?.unit_cost || undefined;
      const totalAmount = unitPrice ? unitPrice * orderData.quantity : undefined;

      // Transform the form data for database insertion with all auto-generated fields
      const dbOrder = transformOrderForDb({
        materialId: orderData.materialId,
        quantity: orderData.quantity,
        notes: orderData.notes,
        unitPrice,
        totalAmount,
        supplier: (materialData as any)?.supplier || undefined,
        supplierOrderId: undefined, // Can be updated later
        expectedDeliveryDate: expectedDelivery.toISOString().split('T')[0],
        actualDeliveryDate: undefined,
        status: 'ordered' as const,
        userId: user.id
      });

      const { data, error } = await (supabase as any)
        .from('orders')
        .insert([dbOrder])
        .select(`
          *,
          materials(
            id,
            name,
            description,
            unit,
            category,
            supplier,
            image_url
          )
        `)
        .single();

      if (error) throw error;

      // Transform back and add to local state using the enhanced transformation
      const newOrder = transformOrderWithMaterialFromDb(data);
      
      setOrders(prev => [newOrder, ...prev]);
      
      // Trigger refresh of suggested orders
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error('Error creating order:', err);
      throw err; // Re-throw to let the modal handle the error
    }
  };

  const handleEdit = (id: string) => {
    console.log("Edit order:", id);
    // TODO: Implement edit order functionality
  };

  const handleCancel = async (id: string) => {
    try {
      // Delete the order from database
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove from local state immediately for optimistic UI update
      setOrders(prev => prev.filter(order => order.id !== id));

      // Trigger refresh of suggested orders since deleting an order might create new suggestions
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error('Error deleting order:', err);
      // Re-fetch orders to ensure UI is in sync if deletion failed
      fetchOrders();
    }
  };

  // Get unique suppliers for filter dropdown
  const uniqueSuppliers = Array.from(new Set(orders.map(o => o.supplier).filter(Boolean))) as string[];

  // Filter orders based on search term, status, and supplier
  const filteredOrders = orders.filter(order => {
    // Search filter
    const matchesSearch = !searchTerm || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.materialName && order.materialName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.supplier && order.supplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.supplierOrderId && order.supplierOrderId.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    // Supplier filter
    const matchesSupplier = supplierFilter === "all" || order.supplier === supplierFilter;

    return matchesSearch && matchesStatus && matchesSupplier;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <OrdersHeader
          searchTerm=""
          onSearchChange={() => {}}
          showFilters={false}
          onToggleFilters={() => {}}
          statusFilter="all"
          onStatusChange={() => {}}
          supplierFilter="all"
          onSupplierChange={() => {}}
          suppliers={[]}
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
        
        <SuggestedOrders />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading orders: {error}</p>
        <Button onClick={fetchOrders} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OrdersHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        supplierFilter={supplierFilter}
        onSupplierChange={setSupplierFilter}
        suppliers={uniqueSuppliers}
        onClearFilters={handleClearFilters}
        onAddNew={handleAddNew}
      />

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8">
            {orders.length === 0 ? (
              <>
                <p className="text-gray-500">No orders found</p>
                <Button 
                  className="mt-4 bg-brand-500 hover:bg-brand-600 text-white"
                  onClick={handleAddNew}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Order
                </Button>
              </>
            ) : (
              <>
                <p className="text-gray-500">No orders match your search</p>
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
          filteredOrders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onEdit={handleEdit}
              onCancel={handleCancel}
            />
          ))
        )}
      </div>

      <SuggestedOrders onOrderAdded={fetchOrders} key={refreshKey} />

      <AddOrderModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddOrder}
      />
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrdersHeader } from "./orders-header";
import { OrderRow } from "./order-row";
import { SuggestedOrders } from "./suggested-orders";
import { createClient } from "@/lib/supabase/client";
import { Order, transformOrderFromDb } from "@/lib/types/orders";

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [supplierFilter, setSupplierFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
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
          materials!inner(
            id,
            name,
            unit
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedOrders = data?.map(transformOrderFromDb) || [];
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
    console.log("Add new order clicked");
    // TODO: Implement add new order functionality
  };

  const handleEdit = (id: string) => {
    console.log("Edit order:", id);
    // TODO: Implement edit order functionality
  };

  const handleCancel = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === id 
          ? { ...order, status: 'cancelled' as const }
          : order
      ));
    } catch (err) {
      console.error('Error cancelling order:', err);
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

      <SuggestedOrders onOrderAdded={fetchOrders} />
    </div>
  );
}
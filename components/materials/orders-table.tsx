"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrdersHeader } from "./orders-header";
import { OrderRow } from "./order-row";

interface Order {
  id: string;
  material: string;
  quantity: string;
  supplier: string;
  expectedDelivery: string;
  status: 'ordered' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

// Mock data - replace with actual data fetching
const mockOrders: Order[] = [
  {
    id: "MO-001",
    material: "Cotton T-Shirt Blanks",
    quantity: "500 units",
    supplier: "TextileCorp",
    expectedDelivery: "Jan 25, 2025",
    status: "ordered"
  },
  {
    id: "MO-002",
    material: "Vinyl Stickers",
    quantity: "2,000 sheets",
    supplier: "PrintSupply Co",
    expectedDelivery: "Jan 28, 2025",
    status: "processing"
  },
  {
    id: "MO-003",
    material: "Heat Transfer Vinyl",
    quantity: "100 rolls",
    supplier: "VinylWorld",
    expectedDelivery: "Feb 2, 2025",
    status: "shipped"
  }
];

export function OrdersTable() {
  const [orders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [supplierFilter, setSupplierFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

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

  const handleCancel = (id: string) => {
    console.log("Cancel order:", id);
    // TODO: Implement cancel order functionality
  };

  // Get unique suppliers for filter dropdown
  const uniqueSuppliers = Array.from(new Set(orders.map(o => o.supplier).filter(Boolean))) as string[];

  // Filter orders based on search term, status, and supplier
  const filteredOrders = orders.filter(order => {
    // Search filter
    const matchesSearch = !searchTerm || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.quantity.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    // Supplier filter
    const matchesSupplier = supplierFilter === "all" || order.supplier === supplierFilter;

    return matchesSearch && matchesStatus && matchesSupplier;
  });

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
    </div>
  );
}
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrdersSearch } from "./orders-search";
import { OrdersFilter } from "./orders-filter";

interface OrdersHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  supplierFilter: string;
  onSupplierChange: (value: string) => void;
  suppliers: string[];
  onClearFilters: () => void;
  onAddNew?: () => void;
}

export function OrdersHeader({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  statusFilter,
  onStatusChange,
  supplierFilter,
  onSupplierChange,
  suppliers,
  onClearFilters,
  onAddNew
}: OrdersHeaderProps) {
  return (
    <div className="space-y-4 px-4 pt-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 relative">
          <OrdersSearch 
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
          />
          <OrdersFilter
            showFilters={showFilters}
            onToggleFilters={onToggleFilters}
            statusFilter={statusFilter}
            onStatusChange={onStatusChange}
            supplierFilter={supplierFilter}
            onSupplierChange={onSupplierChange}
            suppliers={suppliers}
            onClearFilters={onClearFilters}
          />
        </div>
        <Button 
          className="bg-brand-500 hover:bg-brand-600 text-white"
          onClick={onAddNew}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Order
        </Button>
      </div>
    </div>
  );
}
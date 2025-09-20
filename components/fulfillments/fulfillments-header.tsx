import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FulfillmentsSearch } from "@/components/fulfillments/fulfillments-search";
import { FulfillmentsFilter } from "@/components/fulfillments/fulfillments-filter";

interface FulfillmentsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  customerFilter: string;
  onCustomerChange: (value: string) => void;
  customers: string[];
  onClearFilters: () => void;
  onAddNew?: () => void;
}

export function FulfillmentsHeader({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  statusFilter,
  onStatusChange,
  customerFilter,
  onCustomerChange,
  customers,
  onClearFilters,
  onAddNew
}: FulfillmentsHeaderProps) {
  return (
    <div className="space-y-4 px-4 pt-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 relative">
          <FulfillmentsSearch 
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
          />
          <FulfillmentsFilter
            showFilters={showFilters}
            onToggleFilters={onToggleFilters}
            statusFilter={statusFilter}
            onStatusChange={onStatusChange}
            customerFilter={customerFilter}
            onCustomerChange={onCustomerChange}
            customers={customers}
            onClearFilters={onClearFilters}
          />
        </div>
        <Button 
          className="bg-brand-500 hover:bg-brand-600 text-white"
          onClick={onAddNew}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Fulfillment
        </Button>
      </div>
    </div>
  );
}
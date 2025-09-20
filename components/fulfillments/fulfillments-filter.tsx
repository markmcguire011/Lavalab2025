import { useEffect, useRef } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FulfillmentsFilterProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  customerFilter: string;
  onCustomerChange: (value: string) => void;
  customers: string[];
  onClearFilters: () => void;
}

export function FulfillmentsFilter({
  showFilters,
  onToggleFilters,
  statusFilter,
  onStatusChange,
  customerFilter,
  onCustomerChange,
  customers,
  onClearFilters
}: FulfillmentsFilterProps) {
  const filterRef = useRef<HTMLDivElement>(null);
  const hasActiveFilters = statusFilter !== "all" || customerFilter !== "all";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        if (showFilters) {
          onToggleFilters();
        }
      }
    }

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showFilters, onToggleFilters]);

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" }
  ];

  return (
    <div className="relative" ref={filterRef}>
      <Button 
        variant="outline" 
        size="sm"
        onClick={onToggleFilters}
        className={showFilters ? "bg-gray-100" : ""}
      >
        <Filter className="h-4 w-4 mr-2" />
        Filter
        {hasActiveFilters && (
          <span className="ml-1 bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">
            {(statusFilter !== "all" ? 1 : 0) + (customerFilter !== "all" ? 1 : 0)}
          </span>
        )}
      </Button>

      {showFilters && (
        <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg p-4 z-10 min-w-[400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select 
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer
              </label>
              <select 
                value={customerFilter}
                onChange={(e) => onCustomerChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Customers</option>
                {customers.map(customer => (
                  <option key={customer} value={customer}>
                    {customer}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onClearFilters}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
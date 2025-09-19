import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MaterialsSearch } from "./materials-search";
import { MaterialsFilter } from "./materials-filter";

interface MaterialsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  stockFilter: string;
  onStockChange: (value: string) => void;
  categories: string[];
  onClearFilters: () => void;
  onAddNew?: () => void;
}

export function MaterialsHeader({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  categoryFilter,
  onCategoryChange,
  stockFilter,
  onStockChange,
  categories,
  onClearFilters,
  onAddNew
}: MaterialsHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 relative">
          <MaterialsSearch 
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
          />
          <MaterialsFilter
            showFilters={showFilters}
            onToggleFilters={onToggleFilters}
            categoryFilter={categoryFilter}
            onCategoryChange={onCategoryChange}
            stockFilter={stockFilter}
            onStockChange={onStockChange}
            categories={categories}
            onClearFilters={onClearFilters}
          />
        </div>
        <Button 
          className="bg-brand-500 hover:bg-brand-600 text-white"
          onClick={onAddNew}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </div>
    </div>
  );
}
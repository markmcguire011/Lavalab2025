import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MaterialsFilterProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  stockFilter: string;
  onStockChange: (value: string) => void;
  categories: string[];
  onClearFilters: () => void;
}

export function MaterialsFilter({
  showFilters,
  onToggleFilters,
  categoryFilter,
  onCategoryChange,
  stockFilter,
  onStockChange,
  categories,
  onClearFilters
}: MaterialsFilterProps) {
  const hasActiveFilters = categoryFilter !== "all" || stockFilter !== "all";

  return (
    <div className="relative">
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
            {(categoryFilter !== "all" ? 1 : 0) + (stockFilter !== "all" ? 1 : 0)}
          </span>
        )}
      </Button>

      {showFilters && (
        <div className="absolute top-full left-0 mt-2 bg-white border rounded-lg shadow-lg p-4 z-10 min-w-[400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select 
                value={categoryFilter}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Status
              </label>
              <select 
                value={stockFilter}
                onChange={(e) => onStockChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Items</option>
                <option value="low">Low Stock (Need More)</option>
                <option value="sufficient">Sufficient Stock</option>
                <option value="zero">Out of Stock</option>
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
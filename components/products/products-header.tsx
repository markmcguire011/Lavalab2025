import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductsSearch } from "@/components/products/products-search";
import { ProductsFilter } from "@/components/products/products-filter";

interface ProductsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  materialFilter: string;
  onMaterialChange: (value: string) => void;
  categories: string[];
  materials: string[];
  onClearFilters: () => void;
  onAddNew?: () => void;
}

export function ProductsHeader({
  searchTerm,
  onSearchChange,
  showFilters,
  onToggleFilters,
  categoryFilter,
  onCategoryChange,
  materialFilter,
  onMaterialChange,
  categories,
  materials,
  onClearFilters,
  onAddNew
}: ProductsHeaderProps) {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 relative">
          <ProductsSearch 
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
          />
          <ProductsFilter
            showFilters={showFilters}
            onToggleFilters={onToggleFilters}
            categoryFilter={categoryFilter}
            onCategoryChange={onCategoryChange}
            materialFilter={materialFilter}
            onMaterialChange={onMaterialChange}
            categories={categories}
            onClearFilters={onClearFilters}
            materials={materials}
          />
        </div>
        <Button 
          className="bg-brand-500 hover:bg-brand-600 text-white"
          onClick={onAddNew}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Product
        </Button>
      </div>
    </div>
  );
}
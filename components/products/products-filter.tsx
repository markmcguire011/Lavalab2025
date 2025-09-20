"use client";

import { useRef, useEffect } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductsFilterProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  materialFilter: string;
  onMaterialChange: (value: string) => void;
  categories: string[];
  materials: string[];
  onClearFilters: () => void;
}

export function ProductsFilter({
  showFilters,
  onToggleFilters,
  categoryFilter,
  onCategoryChange,
  materialFilter,
  onMaterialChange,
  categories,
  materials,
  onClearFilters
}: ProductsFilterProps) {
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        onToggleFilters();
      }
    }

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showFilters, onToggleFilters]);

  const hasActiveFilters = categoryFilter !== "all" || materialFilter !== "all";

  return (
    <div className="relative" ref={filterRef}>
      <Button
        variant="outline"
        onClick={onToggleFilters}
        className={`relative ${hasActiveFilters ? 'border-blue-500 bg-blue-50' : ''}`}
      >
        <Filter className="h-4 w-4 mr-2" />
        Filter
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full"></span>
        )}
      </Button>

      {showFilters && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFilters}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
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
                Material
              </label>
              <select
                value={materialFilter}
                onChange={(e) => onMaterialChange(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Materials</option>
                {materials.map(material => (
                  <option key={material} value={material}>
                    {material}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="w-full"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
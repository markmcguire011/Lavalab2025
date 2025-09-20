import { Search } from "lucide-react";

interface ProductsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function ProductsSearch({ searchTerm, onSearchChange }: ProductsSearchProps) {
  return (
    <div className="relative -z-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <input
        type="text"
        placeholder="Search products..."
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80 text-sm"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MaterialsSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export function MaterialsSearch({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search materials..." 
}: MaterialsSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input 
        placeholder={placeholder}
        className="pl-10 w-80"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}
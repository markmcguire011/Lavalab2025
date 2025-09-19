import { Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function OrdersTable() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search orders..." 
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <Button className="bg-brand-500 hover:bg-brand-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Order
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableCaption>A list of your material orders in queue.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Expected Delivery</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">#MO-001</TableCell>
              <TableCell>Cotton T-Shirt Blanks</TableCell>
              <TableCell>500 units</TableCell>
              <TableCell>TextileCorp</TableCell>
              <TableCell>Jan 25, 2025</TableCell>
              <TableCell className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Ordered
                </span>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">#MO-002</TableCell>
              <TableCell>Vinyl Stickers</TableCell>
              <TableCell>2,000 sheets</TableCell>
              <TableCell>PrintSupply Co</TableCell>
              <TableCell>Jan 28, 2025</TableCell>
              <TableCell className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Processing
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
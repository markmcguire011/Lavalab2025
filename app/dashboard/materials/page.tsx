import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function MaterialsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-5 ">
      <Tabs defaultValue="inventory" className="w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Materials</h1>
          <TabsList className="grid w-auto grid-cols-2">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="order-queue">Order Queue</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="inventory" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search materials..." 
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
              Add New
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableCaption>A list of your materials inventory.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Unit Cost</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Cotton T-Shirt Blanks</TableCell>
                  <TableCell>Apparel</TableCell>
                  <TableCell>250 units</TableCell>
                  <TableCell>$4.50</TableCell>
                  <TableCell>TextileCorp</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      In Stock
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Vinyl Stickers</TableCell>
                  <TableCell>Print Media</TableCell>
                  <TableCell>1,200 sheets</TableCell>
                  <TableCell>$0.85</TableCell>
                  <TableCell>PrintSupply Co</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      In Stock
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Embroidery Thread</TableCell>
                  <TableCell>Notions</TableCell>
                  <TableCell>45 spools</TableCell>
                  <TableCell>$2.25</TableCell>
                  <TableCell>ThreadMaster</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Low Stock
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="order-queue" className="space-y-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

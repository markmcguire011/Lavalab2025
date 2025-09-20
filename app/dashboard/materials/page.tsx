import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InventoryTable } from "@/components/materials/inventory-table";
import { OrdersTable } from "@/components/materials/orders-table";

export default async function MaterialsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-10">
      <Tabs defaultValue="inventory" className="w-full">
        <div className="flex justify-between items-center py-3">
          <h1 className="text-3xl font-semibold">Materials</h1>
          <TabsList className="grid w-auto h-auto grid-cols-2 p-1">
            <TabsTrigger value="inventory" className="font-normal p-2">Inventory</TabsTrigger>
            <TabsTrigger value="order-queue" className="font-normal p-2">Order Queue</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="inventory" className="bg-white p-3 rounded-lg border border-gray-200">
          <InventoryTable />
        </TabsContent>
        <TabsContent value="order-queue" className="bg-white p-3 rounded-lg border border-gray-200">
          <OrdersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

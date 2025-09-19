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
    <div className="flex-1 w-full flex flex-col gap-6 p-5 ">
      <Tabs defaultValue="inventory" className="w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Materials</h1>
          <TabsList className="grid w-auto grid-cols-2">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="order-queue">Order Queue</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="inventory">
          <InventoryTable />
        </TabsContent>
        <TabsContent value="order-queue">
          <OrdersTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}

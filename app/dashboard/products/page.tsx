import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductsGrid } from "@/components/products/products-grid";

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-2 px-10 pt-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-medium">Products</h1>
      </div>
      <ProductsGrid />
    </div>
  );
}

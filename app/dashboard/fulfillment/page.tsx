import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function FulfillmentPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="gap-2 p-10">
      <div className="flex justify-between items-center py-3">
        <h1 className="text-3xl font-medium">Fulfillment</h1>
      </div>
      
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <AppSidebar />
      <main className="ml-64">
        {children}
      </main>
    </>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const { data: { user } } = await supabase.auth.getUser();
  const firstName = user?.user_metadata?.first_name;

  const quickActions = [
    {
      title: "Materials",
      description: "Manage inventory and track material orders",
      icon: "/icons/materials.svg",
      href: "/dashboard/materials"
    },
    {
      title: "Products", 
      description: "Create and manage your product catalog",
      icon: "/icons/products.svg",
      href: "/dashboard/products"
    },
    {
      title: "Fulfillment",
      description: "Process orders and manage shipping",
      icon: "/icons/fulfillment.svg",
      href: "/dashboard/fulfillment"
    },
    {
      title: "Integrations",
      description: "Connect external services and platforms",
      icon: "/icons/integrations.svg",
      href: "/dashboard/integrations"
    }
  ];

  return (
    <div className="flex-1 w-full flex flex-col gap-12 p-8">
      <div className="space-y-3">
        <h1 className="text-2xl font-medium text-gray-900">
          Welcome{firstName ? ` ${firstName}` : ''}
        </h1>
        <p className="text-gray-500 text-sm">
          Manage your inventory and operations
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {quickActions.slice(0, 3).map((action) => {
          return (
            <Link 
              key={action.href} 
              href={action.href}
              className="group block p-6 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-brand-50 transition-colors">
                  <Image 
                    src={action.icon} 
                    alt={`${action.title} icon`}
                    width={24} 
                    height={24}
                    className="h-6 w-6 opacity-60"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900 group-hover:text-gray-700">
                    {action.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

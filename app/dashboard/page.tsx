import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

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
    <div className="flex-1 w-full flex flex-col gap-8 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what you can do to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action) => {
          return (
            <Card key={action.href} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center space-x-4">
                  <Image 
                    src={action.icon} 
                    alt={`${action.title} icon`}
                    width={32} 
                    height={32}
                    className="h-8 w-8"
                  />
                  <div>
                    <CardTitle className="text-xl">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={action.href}>
                    Go to {action.title}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

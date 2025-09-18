"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

interface AppSidebarProps {
  user?: {
    email?: string;
    user_metadata?: {
      first_name?: string;
      last_name?: string;
      full_name?: string;
    };
  };
}

export function AppSidebar({ user }: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const navigationItems = [
    {
      href: "/dashboard/materials",
      label: "Materials",
      icon: "/icons/materials.svg"
    },
    {
      href: "/dashboard/products", 
      label: "Products",
      icon: "/icons/products.svg"
    },
    {
      href: "/dashboard/fulfillment",
      label: "Fulfillment", 
      icon: "/icons/fulfillment.svg"
    }
  ];

  const integrationItems = [
    {
      href: "/dashboard/integrations",
      label: "Integrations",
      icon: "/icons/integrations.svg"
    }
  ];

  const getInitials = () => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name.charAt(0)}${user.user_metadata.last_name.charAt(0)}`.toUpperCase();
    }
    if (user?.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(" ");
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
      }
      return user.user_metadata.full_name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    return user?.email || "User";
  };

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <Image src="/tally_logo_2.svg" alt="Tally Logo" width={32} height={32} />
          <span className="font-normal text-xl text-brand-500 dark:text-brand-400">Tally</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      asChild 
                      className={`h-12 rounded-md ${
                        isActive 
                          ? 'border border-brand-200 bg-brand-50 text-brand-900 dark:bg-brand-900 dark:text-brand-100 shadow-sm' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Link href={item.href}>
                        <Image src={item.icon} alt={item.label} width={20} height={20} />
                        <span className="font-normal">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="h-px bg-gray-200 dark:bg-gray-700 my-4" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {integrationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      asChild 
                      className={`h-12 px-4 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? 'border border-brand-200 bg-brand-50 text-brand-900 dark:bg-brand-900 dark:text-brand-100 shadow-sm' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Link href={item.href}>
                        <Image src={item.icon} alt={item.label} width={20} height={20} />
                        <span className="font-normal">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto">
        <div className="space-y-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-100 hover:bg-gray-50 dark:hover:bg-gray-800 h-10 px-4 rounded-lg"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
          
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-brand-500 text-white text-xs font-medium">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{getUserName()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
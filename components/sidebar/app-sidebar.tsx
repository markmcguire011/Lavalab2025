"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image"  ;
import { LogOut, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { EditAccountModal } from "@/components/account/edit-account-modal";

interface SidebarItem {
  name: string;
  href: string;
  icon: string;
}

const sidebarItems: SidebarItem[] = [
  {
    name: "Materials",
    href: "/dashboard/materials",
    icon: "/icons/materials.svg"
  },
  {
    name: "Products", 
    href: "/dashboard/products",
    icon: "/icons/products.svg"
  },
  {
    name: "Fulfillment",
    href: "/dashboard/fulfillment", 
    icon: "/icons/fulfillment.svg"
  },
  {
    name: "Integrations",
    href: "/dashboard/integrations", 
    icon: "/icons/integrations.svg"
  }
];

interface AppSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

export function AppSidebar({ isCollapsed = false, onToggleCollapse }: AppSidebarProps) {
  const pathname = usePathname();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  
  const collapsed = onToggleCollapse ? isCollapsed : internalCollapsed;
  const setCollapsed = onToggleCollapse || setInternalCollapsed;

  return (
    <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${
      collapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Logo/Header */}
      <div className="pt-6 px-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image 
              src="/tally_logo_2.svg" 
              alt="Tally" 
              width={32} 
              height={32}
              className="w-8 h-8 flex-shrink-0"
            />
            {!collapsed && (
              <span className="text-xl font-semibold text-brand-500">Tally</span>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-transparent" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href;
            const isLastItem = index === sidebarItems.length - 1;
            
            return (
              <li key={item.name}>
                {isLastItem && (
                  <div className="border-t border-gray-200 my-4"></div>
                )}
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg text-sm font-normal transition-colors ${
                    collapsed 
                      ? "p-2 justify-center" 
                      : "px-3 py-2"
                  } ${
                    isActive
                      ? "bg-brand-50 text-brand-700 border border-brand-200"
                      : "text-gray-400 hover:text-gray-900 hover:bg-gray-50 border border-transparent"
                  }`}
                  title={collapsed ? item.name : ""}
                >
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={20}
                    height={20}
                    className={`flex-shrink-0 ${isActive ? "opacity-100" : "opacity-60"}`}
                  />
                  {!collapsed && item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <UserInfo isCollapsed={collapsed} />
    </div>
  );
}

function UserInfo({ isCollapsed }: { isCollapsed: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();
  }, [supabase]);

  const getInitials = (user: User) => {
    if (user.user_metadata?.first_name && user.user_metadata?.last_name) {
      return (user.user_metadata.first_name[0] + user.user_metadata.last_name[0]).toUpperCase();
    }
    const email = user.email || '';
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email[0].toUpperCase();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleEditClick = () => {
    setShowEditForm(true);
  };

  const handleFormCancel = () => {
    setShowEditForm(false);
  };

  const handleFormSave = async () => {
    setShowEditForm(false);
    // Refresh user data
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  if (!user) return null;

  return (
    <div className="p-4 space-y-4 z-50">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center font-normal text-left text-red-500 hover:text-red-600 hover:bg-gray-50 text-sm px-2 py-3 rounded transition-colors"
          title="Sign out"
        >
          <LogOut className={`${isCollapsed ? "mr-0" : "mr-6"}`} />
          {!isCollapsed && ("Logout")}
        </button>
      
      <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
        <div 
          className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white font-medium text-sm cursor-pointer hover:bg-brand-600 transition-colors"
          onClick={isCollapsed ? handleEditClick : undefined}
          title={isCollapsed ? "Edit profile" : ""}
        >
          {getInitials(user)}
        </div>
        
        {!isCollapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.user_metadata?.first_name && user.user_metadata?.last_name 
                  ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                  : user.email?.split('@')[0]
                }
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
            </div>
            <button
              onClick={handleEditClick}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors"
              title="Edit profile"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
      
      <EditAccountModal
        isOpen={showEditForm}
        onClose={handleFormCancel}
        onSave={handleFormSave}
      />
    </div>
  );
}
"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <AppSidebar isCollapsed={isCollapsed} onToggleCollapse={setIsCollapsed} />
      <main className={`transition-all duration-300 ease-in-out ${
        isCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {children}
      </main>
    </>
  );
}
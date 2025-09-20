"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

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
  }
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Image 
            src="/tally_logo_2.svg" 
            alt="Tally" 
            width={32} 
            height={32}
            className="w-8 h-8"
          />
          <span className="text-xl font-semibold text-brand-500">Tally</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-50 text-brand-700 border border-brand-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={20}
                    height={20}
                    className={`w-5 h-5 ${isActive ? "opacity-100" : "opacity-60"}`}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
"use client";

import Link from 'next/link';

import { usePathname } from 'next/navigation';
import useSettings from "@/hooks/useSettings";
import { LayoutDashboard, ShoppingBag, Tags, Image as ImageIcon, ShoppingCart, Settings, User, Home } from "lucide-react";

export default function Sidebar({ open, onClose }) {
  const { siteName, logo } = useSettings();
  const pathname = usePathname();
  
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/dashboard/products",
      icon: ShoppingBag,
    },
    {
      name: "Categories",
      path: "/dashboard/categories",
      icon: Tags,
    },
    {
      name: "Banners",
      path: "/dashboard/banners",
      icon: ImageIcon,
    },
    {
      name: "Orders",
      path: "/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: Settings,
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: User,
    },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between border-r bg-card p-5 transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <img src={logo} alt={siteName} className="mb-6 h-14 w-auto object-contain dark:invert" />

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive =
                item.path === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.path);

              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className={`size-4.5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Store Shortcut */}
        <div className="pt-4 border-t border-border">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 hover:bg-muted px-4 py-2.5 text-sm font-medium text-foreground transition-all group"
          >
            <Home className="size-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span>Visit Main Store</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

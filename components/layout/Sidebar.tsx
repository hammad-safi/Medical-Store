"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Inventory", path: "/dashboard/inventory", icon: Package },
  { name: "Purchase", path: "/dashboard/purchase", icon: ShoppingCart },
  { name: "Sales", path: "/dashboard/sales", icon: DollarSign },
  { name: "Suppliers", path: "/dashboard/suppliers", icon: Users },
  { name: "Reports", path: "/reports", icon: BarChart3 },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar({
  isOpen,
  collapsed,
  onToggle,
  onClose,
}: {
  isOpen: boolean;
  collapsed: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/v1/users/logout", {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    } catch (error) {
      alert("Logout failed");
    }
  };

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50
        bg-gradient-to-b from-blue-900 to-blue-800 text-white
        transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg">MediCare</h1>
              <p className="text-xs text-blue-200">Medical Store</p>
            </div>
          )}

          <button
            onClick={onToggle}
            className="hidden lg:flex p-2 hover:bg-blue-700 rounded"
          >
            <ChevronLeft
              className={`transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;

            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${active ? "bg-white text-blue-900" : "hover:bg-blue-700"}
                ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.name : ""}
              >
                <Icon size={20} />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-blue-700
            ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut size={20} />
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
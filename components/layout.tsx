"use client";
import { ReactNode } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, Package, Truck, ShoppingCart, BarChart3, 
  LogOut, User, Settings, Bell, Search, Menu, X,
  Users, Activity
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { href: "/inventory", label: "Inventory", icon: <Package size={20} /> },
    { href: "/suppliers", label: "Suppliers", icon: <Truck size={20} /> },
    { href: "/purchases", label: "Purchases", icon: <ShoppingCart size={20} /> },
    { href: "/sales", label: "Sales", icon: <BarChart3 size={20} /> },
    { href: "/customers", label: "Customers", icon: <Users size={20} /> },
    { href: "/reports", label: "Reports", icon: <Activity size={20} /> },
  ];

  // Don't show layout on auth pages
  const isAuthPage = ["/login", "/register", "/forgot-password"].includes(pathname);
  
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Top Navigation */}
      <header className={`sticky top-0 z-50 transition-shadow duration-200 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-white"
      }`}>
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Package className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">PharmaStock</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    Pharmacy Management System
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    pathname === item.href
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Settings size={20} />
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-2 border-white">
                    <User size={18} className="text-blue-600" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.fullName || user?.userName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-4 lg:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg ${
                    pathname === item.href
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
              <button
                onClick={logout}
                className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} PharmaStock. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Pharmacy Management System v1.0.0
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-sm text-gray-600 hover:text-blue-600">
                Privacy Policy
              </button>
              <button className="text-sm text-gray-600 hover:text-blue-600">
                Terms of Service
              </button>
              <button className="text-sm text-gray-600 hover:text-blue-600">
                Support
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
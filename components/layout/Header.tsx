"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  Menu,
  X,
  User,
  Mail,
  Calendar,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const modules = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Inventory", path: "/dashboard/inventory" },
  { name: "Purchase", path: "/purchase" },
  { name: "Sales", path: "/sales" },
  { name: "Suppliers", path: "/suppliers" },
  { name: "Reports", path: "/reports" },
];

const notifications = [
  { id: 1, text: "New order received", time: "5 min ago", unread: true },
  { id: 2, text: "Inventory low alert", time: "1 hour ago", unread: true },
  { id: 3, text: "Monthly report ready", time: "2 hours ago", unread: false },
  { id: 4, text: "Supplier meeting", time: "Yesterday", unread: false },
];

export default function Header({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const pathname = usePathname();
  const currentModule =
    modules.find((m) => pathname.startsWith(m.path))?.name || "Dashboard";

  const [showModules, setShowModules] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const modulesRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modulesRef.current && !modulesRef.current.contains(event.target as Node)) {
        setShowModules(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node) && window.innerWidth < 1024) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Current Module / Breadcrumb */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-gray-500">MediCare /</span>
            <div className="relative" ref={modulesRef}>
              <button
                onClick={() => setShowModules(!showModules)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-900">{currentModule}</span>
                <ChevronDown size={16} className={`transition-transform ${showModules ? "rotate-180" : ""}`} />
              </button>
              
              {/* Module Dropdown */}
              {showModules && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  {modules.map((module) => (
                    <Link
                      key={module.name}
                      href={module.path}
                      onClick={() => setShowModules(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors"
                    >
                      <span className={`font-medium ${currentModule === module.name ? "text-blue-600" : "text-gray-700"}`}>
                        {module.name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Title */}
          <div className="md:hidden">
            <h1 className="font-semibold text-gray-900">{currentModule}</h1>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-2xl mx-4" ref={searchRef}>
          <div className={`relative ${searchOpen ? "block" : "hidden lg:block"}`}>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, inventory, customers..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="lg:hidden absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 lg:gap-2">
          {/* Mobile Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Search"
          >
            <Search size={20} className="text-gray-600" />
          </button>

          {/* Help */}
          <button
            className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Help"
          >
            <HelpCircle size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Help</span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={20} className="text-gray-600" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <span className="text-xs text-gray-500">You have 2 new notifications</span>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-2 h-2 rounded-full ${notification.unread ? "bg-blue-500" : "bg-gray-300"}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{notification.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="px-4 py-3 border-t border-gray-100">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-sm font-medium text-gray-900">Sarah Johnson</span>
                <span className="text-xs text-gray-500">Store Manager</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-semibold shadow-sm">
                SJ
              </div>
              <ChevronDown 
                size={16} 
                className={`text-gray-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`}
              />
            </button>
            
            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">sarah@medicare.com</p>
                </div>
                
                <div className="py-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    <User size={18} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Profile</span>
                  </Link>
                  <Link
                    href="/messages"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    <Mail size={18} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Messages</span>
                    <span className="ml-auto bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">3</span>
                  </Link>
                  <Link
                    href="/calendar"
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    <Calendar size={18} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Calendar</span>
                  </Link>
                </div>
                
                <div className="border-t border-gray-100 pt-2">
                  <button className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
"use client";

import { useState, useRef, useEffect, useCallback, JSX } from "react";
import { Bell, Menu, User, Settings, LogOut, Clock, Calendar, TrendingUp, ShoppingCart, Bug, TestTube, Package } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import api from "@/app/lib/axios";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  priority?: string;
  isRead: boolean;
  createdAt: string;
  metadata?: {
    invoiceNumber?: string;
  };
}

interface NotificationStats {
  total?: number;
  unread?: number;
  highPriority?: number;
  todayCount?: number;
}

interface UserType {
  fullName?: string;
  role?: string;
  email?: string;
}

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const { token, user } = useAuth() as { token: string | null; user: UserType | null };
  const [sales, setSales] = useState<any[]>([]);
  const [purchaseCount, setPurchaseCount] = useState<number>(0);
  const [inventoryCount, setInventoryCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notificationStats, setNotificationStats] = useState<NotificationStats>({});
  const [loadingNotifications, setLoadingNotifications] = useState<boolean>(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Debug: Check what's happening
  useEffect(() => {
    console.log("🔍 Header Component State:");
    console.log("  - Token:", token ? "Present" : "Missing");
    console.log("  - User:", user);
    console.log("  - Inventory count:", inventoryCount);
    console.log("  - Notifications count:", notifications.length);
    console.log("  - Unread count:", unreadCount);
  }, [token, user, inventoryCount, notifications, unreadCount]);

  // Fetch notifications with better error handling
  const fetchNotifications = useCallback(async () => {
    console.log("🔄 fetchNotifications called");
    console.log("🔑 Token exists:", !!token);
    
    if (!token) {
      console.log("❌ No token available");
      return;
    }

    try {
      console.log("📡 Making request to /notifications");
      
      const res = await api.get("/notifications", {
        params: {
          limit: 50,
          skip: 0,
          unreadOnly: false
        }
      });
      
      console.log("✅ Notifications API Response:", {
        status: res.status,
        success: res.data.success,
        data: res.data.data
      });
      
      if (res.data.success) {
        const notificationsData = res.data.data.notifications || [];
        const unreadCountData = res.data.data.unreadCount || 0;
        
        console.log(`📊 Received ${notificationsData.length} notifications, ${unreadCountData} unread`);
        
        setNotifications(notificationsData);
        setUnreadCount(unreadCountData);
      }
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);
    }
  }, [token]);

  // Fetch notification stats with comprehensive error handling
  const fetchNotificationStats = useCallback(async () => {
    if (!token) {
      console.log('❌ No token for stats');
      setUnreadCount(0);
      return;
    }

    console.log('📊 Fetching notification stats...');
    
    try {
      const res = await api.get("/notifications/stats");
      console.log('✅ Stats response:', res.data);
      
      if (res.data.success) {
        const unread = res.data.data.unread || 0;
        setUnreadCount(unread);
        setNotificationStats(res.data.data);
      }
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      
      setUnreadCount(0);
      setNotificationStats({
        total: 0,
        unread: 0,
        highPriority: 0,
        todayCount: 0
      });
    }
  }, [token]);

  // Fetch sales data
  useEffect(() => {
    if (!token) return;

    const fetchSales = async () => {
      console.log("💰 Fetching sales data...");
      
      try {
        const res = await api.get("/sales", {
          params: {
            lastDays: 30,
            limit: 100000,
          }
        });

        console.log("✅ Sales API Response:", {
          success: res.data.success,
          salesCount: res.data.data?.sales?.length || 0
        });

        setSales(res.data.data?.sales || []);
      } catch (error) {
        console.error("❌ Error fetching sales:", error);
      }
    };

    fetchSales();
  }, [token]);

  // Fetch purchase data
  const fetchPurchaseLength = useCallback(async () => {
    if (!token) return;

    console.log("🛒 Fetching purchases data...");
    
    try {
      const res = await api.get("/purchases", {
        params: { lastDays: 30, limit: 1 }
      });
      
      console.log("✅ Purchases API Response:", {
        total: res.data.data?.pagination?.total || 0
      });

      setPurchaseCount(res.data.data?.pagination?.total || 0);
    } catch (error) {
      console.error("❌ Error fetching purchase count:", error);
    }
  }, [token]);

  // Fetch inventory data
  const fetchInventory = useCallback(async () => {
    if (!token) return;

    console.log("📦 Fetching inventory data...");
    
    try {
      const res = await api.get("/inventory", {
        params: {
          limit: 1, // We only need the count
          skip: 0
        }
      });
      
      console.log("✅ Inventory API Response:", {
        success: res.data.success,
        inventoryCount: res.data.data?.length || 0
      });

      if (res.data.success) {
        // The inventory endpoint returns an array directly in data property
        const inventoryData = res.data.data || [];
        setInventoryCount(inventoryData.length);
        
        console.log(`📦 Total Inventory Items: ${inventoryData.length}`);
      }
    } catch (error) {
      console.error("❌ Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Poll for new notifications and data
  useEffect(() => {
    if (!token) {
      console.log("❌ No token, skipping data setup");
      return;
    }

    console.log("🔄 Setting up data polling...");

    // Initial fetch
    fetchNotifications();
    fetchNotificationStats();
    fetchPurchaseLength();
    fetchInventory();

    // Set up polling interval for stats and inventory
    const notificationInterval = setInterval(() => {
      console.log("⏰ Polling for data...");
      fetchNotificationStats();
      fetchInventory(); // Refresh inventory count periodically
    }, 30000); // Every 30 seconds

    return () => {
      console.log("🧹 Cleaning up intervals");
      clearInterval(notificationInterval);
    };
  }, [token, fetchNotifications, fetchNotificationStats, fetchPurchaseLength, fetchInventory]);

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    console.log(`📝 Marking notification ${notificationId} as read...`);
    
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      
      setNotifications(prev => prev.map(notif => 
        notif._id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      ));
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      console.log(`✅ Notification marked as read`);
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    console.log("📝 Marking ALL notifications as read...");
    
    try {
      await api.patch("/notifications/read-all");
      
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
      
      console.log("✅ All notifications marked as read");
    } catch (error) {
      console.error("❌ Error marking all as read:", error);
    }
  };

  // Format notification time
  const formatNotificationTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Get priority badge color
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LOW': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'INVENTORY_LOW_STOCK':
        return <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
          <span className="text-yellow-600 text-xs font-bold">!</span>
        </div>;
      case 'INVENTORY_EXPIRING_SOON':
      case 'INVENTORY_EXPIRED':
        return <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-red-600 text-xs font-bold">E</span>
        </div>;
      case 'PURCHASE_RECEIVED':
        return <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-green-600 text-xs font-bold">P</span>
        </div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 text-xs font-bold">i</span>
        </div>;
    }
  };

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      await fetch("http://localhost:8000/api/v1/users/logout", {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("accessToken");
      setShowUserMenu(false);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Refresh data manually
  const refreshData = () => {
    console.log("🔄 Manually refreshing data...");
    fetchNotifications();
    fetchNotificationStats();
    fetchPurchaseLength();
    fetchInventory();
  };

  // Debug buttons component
  const DebugButtons = () => (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      <button
        onClick={refreshData}
        className="bg-blue-500 text-white p-2 rounded-full text-xs shadow-lg flex items-center gap-1"
        title="Refresh All Data"
      >
        🔄 Refresh
      </button>
      
      <button
        onClick={() => {
          console.log("🐛 Current State:", {
            sales: sales.length,
            purchases: purchaseCount,
            inventory: inventoryCount,
            notifications: notifications.length,
            unread: unreadCount
          });
          refreshData();
        }}
        className="bg-red-500 text-white p-2 rounded-full text-xs shadow-lg flex items-center gap-1"
        title="Debug Data"
      >
        <Bug size={12} /> Debug
      </button>
    </div>
  );

  // Notification Item Component Props
  interface NotificationItemProps {
    notification: Notification;
    markAsRead: (id: string) => void;
    getNotificationIcon: (type: string) => JSX.Element;
    getPriorityColor: (priority: string) => string;
    formatNotificationTime: (dateString: string) => string;
  }

  // Separate Notification Item Component for cleaner code
  const NotificationItem = ({ 
    notification, 
    markAsRead, 
    getNotificationIcon, 
    getPriorityColor, 
    formatNotificationTime 
  }: NotificationItemProps) => {
    return (
      <div
        className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors cursor-pointer ${
          !notification.isRead ? 'bg-blue-50' : ''
        }`}
        onClick={() => markAsRead(notification._id)}
      >
        <div className="flex items-start gap-3">
          {getNotificationIcon(notification.type)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
              {notification.priority && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full border ${getPriorityColor(notification.priority)}`}>
                  {notification.priority}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700">{notification.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              {formatNotificationTime(notification.createdAt)}
            </p>
            {notification.metadata?.invoiceNumber && (
              <p className="text-xs text-gray-400 mt-1">
                Invoice: {notification.metadata.invoiceNumber}
              </p>
            )}
            {/* Debug info - visible only in development */}
            {process.env.NODE_ENV === 'development' && (
              <p className="text-xs text-gray-400 mt-1">
                ID: {notification._id.substring(0, 8)}...
              </p>
            )}
          </div>
          {!notification.isRead && (
            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2"></div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6 gap-3">
          {/* Left Section */}
          <div className="flex items-center gap-3 lg:gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>

          {/* Center Section - Stats */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Total Sales Box */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 shadow-sm">
              <div className="p-1.5 bg-green-500 rounded-md">
                <TrendingUp size={16} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-green-700 font-medium">Total Sales</p>
                <p className="text-sm font-bold text-green-900">{`${sales.length}/month`}</p>
              </div>
              <div className="sm:hidden">
                <p className="text-xs font-bold text-green-900">{`${sales.length}/month`}</p>
              </div>
            </div>

            {/* Total Purchases Box */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
              <div className="p-1.5 bg-blue-500 rounded-md">
                <ShoppingCart size={16} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-blue-700 font-medium">Total Purchases</p>
                <p className="text-sm font-bold text-blue-900">{`${purchaseCount}/month`}</p>
              </div>
              <div className="sm:hidden">
                <p className="text-xs font-bold text-blue-900">{`${purchaseCount}/month`}</p>
              </div>
            </div>

            {/* Total Inventory Box */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-lg border border-purple-200 shadow-sm">
              <div className="p-1.5 bg-purple-500 rounded-md">
                <Package size={16} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs text-purple-700 font-medium">Total Inventory</p>
                <p className="text-sm font-bold text-purple-900">
                  {`${inventoryCount} items`}
                </p>
              </div>
              <div className="sm:hidden">
                <p className="text-xs font-bold text-purple-900">
                  {`${inventoryCount}`}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 lg:gap-2">
            {/* Date & Time - Hidden on mobile */}
            <div className="hidden xl:flex flex-col items-end px-3 py-1 bg-gray-50 rounded-lg border border-gray-200 mr-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Calendar size={13} />
                <span className="font-medium">{formatDate(currentTime)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 -mt-0.5">
                <Clock size={13} />
                <span>{formatTime(currentTime)}</span>
              </div>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  // Refresh when opening
                  if (!showNotifications) {
                    fetchNotifications();
                  }
                }}
                className="p-2 rounded-lg hover:bg-blue-50 transition-colors relative text-gray-700 hover:text-blue-600"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 md:w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                  <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-base">Notifications</h3>
                      <span className="text-xs text-blue-100">
                        {unreadCount > 0 
                          ? `You have ${unreadCount} new notification${unreadCount > 1 ? 's' : ''}` 
                          : notifications.length > 0 
                            ? `You have ${notifications.length} notification${notifications.length > 1 ? 's' : ''}` 
                            : 'All caught up!'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={refreshData}
                        className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors mr-2"
                        title="Refresh"
                      >
                        🔄
                      </button>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        <div className="mb-2">No notifications yet</div>
                        <p className="text-xs mt-2 text-gray-400">
                          Stats: {notificationStats.total || 0} total, {notificationStats.unread || 0} unread
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Unread notifications first */}
                        {notifications
                          .filter(n => !n.isRead)
                          .map((notification) => (
                            <NotificationItem 
                              key={notification._id}
                              notification={notification}
                              markAsRead={markAsRead}
                              getNotificationIcon={getNotificationIcon}
                              getPriorityColor={getPriorityColor}
                              formatNotificationTime={formatNotificationTime}
                            />
                          ))
                        }
                        
                        {/* Read notifications */}
                        {notifications
                          .filter(n => n.isRead)
                          .map((notification) => (
                            <NotificationItem 
                              key={notification._id}
                              notification={notification}
                              markAsRead={markAsRead}
                              getNotificationIcon={getNotificationIcon}
                              getPriorityColor={getPriorityColor}
                              formatNotificationTime={formatNotificationTime}
                            />
                          ))
                        }
                      </>
                    )}
                  </div>
                  
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <button 
                      onClick={() => window.location.href = '/notifications'}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      View all notifications ({notifications.length})
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 lg:gap-3 p-1.5 rounded-xl hover:bg-blue-50 transition-colors"
              >
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-900">
                    {user?.fullName || 'Dr. Sarah Johnson'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user?.role || 'Pharmacist Manager'}
                  </span>
                </div>
                <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-semibold shadow-sm flex-shrink-0">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'SJ'}
                </div>
              </button>
              
              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                  <div className="px-4 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center font-bold text-lg">
                        {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'SJ'}
                      </div>
                      <div>
                        <p className="font-semibold text-base">{user?.fullName || 'Dr. Sarah Johnson'}</p>
                        <p className="text-xs text-blue-100">{user?.role || 'Pharmacist Manager'}</p>
                      </div>
                    </div>
                    <p className="text-xs text-blue-100 mt-2">{user?.email || 'sarah.johnson@medicare.com'}</p>
                  </div>
                  
                  <div className="py-2">
                    {/* <button 
                      onClick={handleProfileClick}
                      className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                    >
                      <User size={18} className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">My Profile</span>
                    </button>
                    <button className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left">
                      <Settings size={18} className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Settings</span>
                    </button> */}
                    
                    {/* Date & Time - Mobile only */}
                    <div className="xl:hidden mx-4 my-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                        <Calendar size={13} />
                        <span className="font-medium">{formatDate(currentTime)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock size={13} />
                        <span>{formatTime(currentTime)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 p-2">
                    <button 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors rounded-lg ${
                        isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <LogOut size={18} />
                      <span className="text-sm font-medium">
                        {isLoggingOut ? "Signing out..." : "Sign Out"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {/* <DebugButtons /> */}
    </>
  );
}
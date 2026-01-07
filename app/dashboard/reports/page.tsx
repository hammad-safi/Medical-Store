"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Download, 
  RefreshCw,
  AlertCircle,
  TrendingUp,
  BarChart3,
  CreditCard,
  Loader,
  ChevronRight,
  Calendar
} from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import { useReportData } from "@/app/hooks/useApiData";

export default function ReportsPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toast, setToast] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("Just now");

  // Get report data
  const { 
    data: reportData, 
    isLoading, 
    isFetching, 
    refetch 
  } = useReportData(activeTab);

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  // Update last updated time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle export
  const handleExport = () => {
    setExporting(true);
    // Simulate export process
    setTimeout(() => {
      setExporting(false);
      showToast(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} report exported successfully`);
    }, 1500);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      showToast("Data refreshed successfully", "success");
    } catch (error) {
      showToast("Failed to refresh data", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "sales", label: "Sales", icon: DollarSign },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "purchases", label: "Purchases", icon: ShoppingCart },
    { id: "financial", label: "Financial", icon: CreditCard }
  ];

  const renderContent = () => {
    const data = reportData || {};
    switch (activeTab) {
      case "dashboard":
        return <DashboardView data={data} />;
      case "sales":
        return <SalesView data={data} />;
      case "inventory":
        return <InventoryView data={data} />;
      case "purchases":
        return <PurchasesView data={data} />;
      case "financial":
        return <FinancialView data={data} />;
      default:
        return <div className="text-center py-12 text-gray-500">Select a report type</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
              <p className="text-gray-600">Monitor your pharmacy's performance and key metrics</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
 {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            {/* Left side - could add search or other controls here */}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isFetching}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing || isFetching ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>{exporting ? "Exporting..." : "Export"}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-md transform scale-[1.02]"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

       
        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {isFetching ? (
            <div className="flex flex-col justify-center items-center h-96">
              <Loader className="w-10 h-10 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600 font-medium">Updating data...</p>
            </div>
          ) : (
            <div className="p-6 lg:p-8">
              {renderContent()}
            </div>
          )}
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            <div className={`${
              toast.type === 'success' ? 'bg-green-500' : 
              toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            } text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 max-w-md`}>
              <span className="font-medium">{toast.message}</span>
              <button onClick={() => setToast(null)} className="ml-4 hover:opacity-80">
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Dashboard View Component
function DashboardView({ data }) {
  const safeData = data || {};
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <MetricCard
            title="Today's Revenue"
            value={`$${(safeData.quickStats?.todayRevenue || 0).toFixed(2)}`}
            icon={<DollarSign className="w-6 h-6" />}
            color="green"
            trend="+12.5%"
          />
          <MetricCard
            title="Monthly Revenue"
            value={`$${(safeData.quickStats?.monthRevenue || 0).toFixed(2)}`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="blue"
            trend="+8.3%"
          />
          <MetricCard
            title="Low Stock Alert"
            value={safeData.quickStats?.lowStockCount || 0}
            icon={<AlertCircle className="w-6 h-6" />}
            color="red"
            subtitle="items need reorder"
          />
          <MetricCard
            title="Inventory Value"
            value={`$${(safeData.inventorySummary?.totalValue || 0).toFixed(2)}`}
            icon={<Package className="w-6 h-6" />}
            color="purple"
            trend="+5.7%"
          />
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Total Items"
          value={safeData.inventorySummary?.totalItems || 0}
          icon={<Package className="w-5 h-5 text-blue-600" />}
        />
        <SummaryCard
          label="Total Stock Units"
          value={(safeData.inventorySummary?.totalStock || 0).toLocaleString()}
          icon={<BarChart3 className="w-5 h-5 text-green-600" />}
        />
        <SummaryCard
          label="Today's Transactions"
          value={safeData.quickStats?.todayTransactions || 0}
          icon={<ShoppingCart className="w-5 h-5 text-purple-600" />}
        />
      </div>
    </div>
  );
}

// Sales View Component
function SalesView({ data }) {
  const safeData = data || {};
  const recentSales = safeData.recentSales || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sales Performance</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <MetricCard
            title="Total Sales"
            value={`$${(safeData.summary?.totalSales || 0).toFixed(2)}`}
            icon={<DollarSign className="w-6 h-6" />}
            color="green"
            trend="+15.2%"
          />
          <MetricCard
            title="Transactions"
            value={safeData.summary?.totalTransactions || 0}
            icon={<ShoppingCart className="w-6 h-6" />}
            color="blue"
          />
          <MetricCard
            title="Items Sold"
            value={(safeData.summary?.totalItems || 0).toLocaleString()}
            icon={<Package className="w-6 h-6" />}
            color="purple"
          />
          <MetricCard
            title="Avg Transaction"
            value={`$${(safeData.summary?.averageTransactionValue || 0).toFixed(2)}`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="yellow"
          />
        </div>
      </div>

      {/* Recent Sales Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          {recentSales.length > 0 && (
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {recentSales.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentSales.slice(0, 5).map((sale, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sale.invoiceNumber || `SALE-${index + 1}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {sale.customerName || "Walk-in Customer"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      ${(sale.grandTotal || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 border border-gray-200 rounded-lg">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No recent sales data available</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Inventory View Component
function InventoryView({ data }) {
  const safeData = data || {};
  const lowStockItems = safeData.lowStockItems || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Inventory Status</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <MetricCard
            title="Total Items"
            value={safeData.summary?.totalItems || 0}
            icon={<Package className="w-6 h-6" />}
            color="blue"
          />
          <MetricCard
            title="Total Stock"
            value={(safeData.summary?.totalStock || 0).toLocaleString()}
            icon={<BarChart3 className="w-6 h-6" />}
            color="green"
          />
          <MetricCard
            title="Total Value"
            value={`$${(safeData.summary?.totalValue || 0).toFixed(2)}`}
            icon={<DollarSign className="w-6 h-6" />}
            color="purple"
          />
          <MetricCard
            title="Avg Item Value"
            value={`$${(safeData.summary?.averageStockValue || 0).toFixed(2)}`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="yellow"
          />
        </div>
      </div>

      {/* Low Stock Alert */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Low Stock Alert ({lowStockItems.length})
          </h3>
        </div>
        
        {lowStockItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lowStockItems.slice(0, 6).map((item, index) => (
              <div key={index} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.name || "Unknown Product"}</p>
                    <p className="text-sm text-gray-600 mt-1">{item.category || "Uncategorized"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">{item.stock || 0}</p>
                    <p className="text-xs text-gray-500">units left</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-green-200 bg-green-50 rounded-lg">
            <AlertCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-green-700 font-medium">All items are well-stocked</p>
            <p className="text-green-600 text-sm mt-1">No low stock alerts</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Purchases View Component
function PurchasesView({ data }) {
  const safeData = data || {};

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Purchase Overview</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <MetricCard
            title="Total Spent"
            value={`$${(safeData.summary?.totalSpent || 0).toFixed(2)}`}
            icon={<DollarSign className="w-6 h-6" />}
            color="blue"
          />
          <MetricCard
            title="Items Purchased"
            value={(safeData.summary?.totalItems || 0).toLocaleString()}
            icon={<Package className="w-6 h-6" />}
            color="green"
          />
          <MetricCard
            title="Purchase Orders"
            value={safeData.summary?.totalPurchases || 0}
            icon={<ShoppingCart className="w-6 h-6" />}
            color="purple"
          />
          <MetricCard
            title="Avg Order Value"
            value={`$${(safeData.summary?.averagePurchaseValue || 0).toFixed(2)}`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="yellow"
          />
        </div>
      </div>

      {/* Status Distribution */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard 
            title="Received" 
            value={safeData.statusDistribution?.received || 0} 
            color="green" 
          />
          <StatusCard 
            title="Pending" 
            value={safeData.statusDistribution?.pending || 0} 
            color="yellow" 
          />
          <StatusCard 
            title="Partial" 
            value={safeData.statusDistribution?.partial || 0} 
            color="blue" 
          />
          <StatusCard 
            title="Cancelled" 
            value={safeData.statusDistribution?.cancelled || 0} 
            color="red" 
          />
        </div>
      </div>
    </div>
  );
}

// Financial View Component
function FinancialView({ data }) {
  const safeData = data || {};

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Summary</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <MetricCard
            title="Total Revenue"
            value={`$${(safeData.summary?.totalRevenue || 0).toFixed(2)}`}
            icon={<DollarSign className="w-6 h-6" />}
            color="green"
            trend="+18.2%"
          />
          <MetricCard
            title="Total Cost"
            value={`$${(safeData.summary?.totalCost || 0).toFixed(2)}`}
            icon={<CreditCard className="w-6 h-6" />}
            color="red"
          />
          <MetricCard
            title="Gross Profit"
            value={`$${(safeData.summary?.grossProfit || 0).toFixed(2)}`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="blue"
          />
          <MetricCard
            title="Profit Margin"
            value={`${(safeData.summary?.profitMargin || 0).toFixed(1)}%`}
            icon={<BarChart3 className="w-6 h-6" />}
            color="purple"
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Metrics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 text-center hover:shadow-lg transition-shadow">
            <p className="text-4xl font-bold text-blue-600 mb-2">
              {safeData.keyMetrics?.totalTransactions || 0}
            </p>
            <p className="text-sm font-medium text-gray-700">Total Transactions</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 text-center hover:shadow-lg transition-shadow">
            <p className="text-4xl font-bold text-green-600 mb-2">
              {safeData.keyMetrics?.totalPurchases || 0}
            </p>
            <p className="text-sm font-medium text-gray-700">Total Purchases</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 text-center hover:shadow-lg transition-shadow">
            <p className="text-4xl font-bold text-purple-600 mb-2">
              {safeData.keyMetrics?.totalInventoryItems || 0}
            </p>
            <p className="text-sm font-medium text-gray-700">Inventory Items</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
function MetricCard({ title, value, icon, color, trend, subtitle }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
    yellow: "from-yellow-500 to-yellow-600"
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color] || colorClasses.blue} text-white`}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
}

function SummaryCard({ label, value, icon }) {
  return (
    <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <p className="text-sm font-medium text-gray-600">{label}</p>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function StatusCard({ title, value, color }) {
  const colorClasses = {
    green: "from-green-500 to-green-600 border-green-200",
    yellow: "from-yellow-500 to-yellow-600 border-yellow-200",
    blue: "from-blue-500 to-blue-600 border-blue-200",
    red: "from-red-500 to-red-600 border-red-200"
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color] || colorClasses.green} text-white p-6 rounded-xl border shadow-md hover:shadow-lg transition-all`}>
      <p className="text-sm font-medium opacity-90 mb-2">{title}</p>
      <p className="text-4xl font-bold">{value}</p>
    </div>
  );
}
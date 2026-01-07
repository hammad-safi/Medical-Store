"use client";
import React, { useMemo } from 'react';
import { 
  Package, DollarSign, AlertTriangle, Calendar, 
  TrendingUp, Printer, ShoppingCart, BarChart, 
  RefreshCw, Loader, Activity 
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppData, useDashboardData } from '@/app/hooks/useApiData';

const MedicalStoreDashboard = () => {
  const queryClient = useQueryClient();

  // Use the consolidated app data hook
  const {
    products,
    sales,
    purchases,
    isLoading,
    isFetching,
    isError,
    errors,
    isPreviousData,
    refreshAll,
    refetchInventory,
    refetchSales,
    refetchPurchases,
    refetchSuppliers
  } = useAppData();

  // Calculate stats using useDashboardData
  const { stats: calculatedStats } = useDashboardData();

  // Number formatters
  const numberFormatter = new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' });
  const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', compactDisplay: 'short' });

  // Calculate derived data using useMemo for performance
  const topProducts = useMemo(() => {
    if (!sales.length) return [];
    
    // Group sales by product
    const productSalesMap = new Map();
    
    sales.forEach(sale => {
      sale.items?.forEach(item => {
        const existing = productSalesMap.get(item.productName) || {
          name: item.productName,
          category: 'Uncategorized', // You might need to map this from products
          salesCount: 0,
          revenue: 0
        };
        
        existing.salesCount += item.quantity || 0;
        existing.revenue += item.total || 0;
        productSalesMap.set(item.productName, existing);
      });
    });
    
    // Convert to array and sort by revenue
    return Array.from(productSalesMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [sales, products]);

  const lowStockProducts = useMemo(() => 
    products
      .filter(product => (product.stock || 0) <= 20)
      .slice(0, 10)
      .map(product => ({
        id: product._id,
        name: product.name,
        category: product.category || 'Uncategorized',
        stock: product.stock || 0,
        salePrice: product.salePrice || product.price || 0
      })), 
    [products]
  );

  const expiringProducts = useMemo(() => {
    const now = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(now.getMonth() + 3);
    
    return products
      .filter(product => {
        if (!product.expiry) return false;
        const expiryDate = new Date(product.expiry);
        return expiryDate >= now && expiryDate <= threeMonthsLater;
      })
      .slice(0, 10)
      .map(product => ({
        id: product._id,
        name: product.name,
        category: product.category || 'Uncategorized',
        stock: product.stock || 0,
        expiryDate: product.expiry
      }));
  }, [products]);

  // Print dashboard function
  const printDashboard = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    const content = `
      <html>
        <head>
          <title>Medical Store Dashboard Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
            h2 { color: #1e40af; margin-top: 30px; border-bottom: 2px solid #93c5fd; padding-bottom: 8px; }
            .stats { display: flex; justify-content: space-between; margin: 20px 0; }
            .stat-box { border: 2px solid #ddd; padding: 15px; border-radius: 8px; width: 23%; text-align: center; }
            .stat-box h3 { margin: 0; color: #666; font-size: 14px; }
            .stat-box p { margin: 10px 0 0 0; font-size: 28px; font-weight: bold; color: #2563eb; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #2563eb; color: white; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .alert { background-color: #fef3c7; padding: 10px; border-left: 4px solid #f59e0b; margin: 10px 0; }
            .expiry-alert { background-color: #fee2e2; border-left-color: #ef4444; }
            .print-date { text-align: right; color: #666; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Medical Store Dashboard Report</h1>
          <div class="print-date">Generated on: ${new Date().toLocaleString()}</div>
          
          <div class="stats">
            <div class="stat-box">
              <h3>Total Products</h3>
              <p>${numberFormatter.format(calculatedStats.totalProducts)}</p>
            </div>
            <div class="stat-box">
              <h3>Total Revenue</h3>
              <p>${currencyFormatter.format(calculatedStats.totalRevenue)}</p>
            </div>
            <div class="stat-box">
              <h3>Low Stock Items</h3>
              <p>${numberFormatter.format(calculatedStats.lowStockItems)}</p>
            </div>
            <div class="stat-box">
              <h3>Expiring Soon</h3>
              <p>${numberFormatter.format(calculatedStats.expiringSoon)}</p>
            </div>
          </div>

          <h2>Top 5 Selling Products</h2>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Total Sales</th>
                <th>Revenue Generated</th>
              </tr>
            </thead>
            <tbody>
              ${topProducts.map((p, i) => `
                <tr>
                  <td><strong>#${i + 1}</strong></td>
                  <td>${p.name}</td>
                  <td>${p.category}</td>
                  <td>${numberFormatter.format(p.salesCount)} units</td>
                  <td>${currencyFormatter.format(p.revenue)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2>Low Stock Alerts</h2>
          ${lowStockProducts.length === 0 ? '<p>No low stock items</p>' : 
            lowStockProducts.map(p => `
              <div class="alert">
                <strong>${p.name}</strong> - Current Stock: ${numberFormatter.format(p.stock)} | Reorder Level: 20
              </div>
            `).join('')
          }

          <h2>Expiring Products (Next 3 Months)</h2>
          ${expiringProducts.length === 0 ? '<p>No products expiring soon</p>' : 
            expiringProducts.map(p => `
              <div class="alert expiry-alert">
                <strong>${p.name}</strong> - Expiry Date: ${new Date(p.expiryDate || '').toLocaleDateString()} | Stock: ${numberFormatter.format(p.stock)}
              </div>
            `).join('')
          }

          <h2>Current Inventory</h2>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Sale Price</th>
                <th>Stock Value</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => `
                <tr>
                  <td>${p.name}</td>
                  <td>${p.category}</td>
                  <td>${numberFormatter.format(p.stock || 0)}</td>
                  <td>${currencyFormatter.format(p.salePrice || p.price || 0)}</td>
                  <td>${currencyFormatter.format((p.stock || 0) * (p.salePrice || p.price || 0))}</td>
                  <td>${p.expiry ? new Date(p.expiry).toLocaleDateString() : 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin-top: 30px; padding: 15px; background-color: #dbeafe; border-radius: 8px;">
            <strong>Total Stock Value: ${currencyFormatter.format(calculatedStats.totalStockValue)}</strong>
          </div>
        </body>
      </html>
    `;
    
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          {isPreviousData && (
            <p className="mt-2 text-sm text-blue-600">Showing cached data while refreshing...</p>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">
            {errors[0]?.message || 'Failed to load dashboard data'}
          </p>
          <button
            onClick={refreshAll}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white p-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Medical Store Dashboard</h1>
            <p className="text-blue-100 mt-2 text-lg">Real-time inventory and sales analytics</p>
            {isPreviousData && (
              <div className="mt-2 flex items-center text-blue-200 text-sm">
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse mr-2"></div>
                <span>Updating data...</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={refreshAll}
              disabled={isFetching}
              className="flex items-center space-x-2 bg-white/20 text-white px-4 py-3 rounded-lg hover:bg-white/30 transition shadow-lg font-semibold disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
              <span>{isFetching ? 'Refreshing...' : 'Refresh All'}</span>
            </button>
            <button
              onClick={printDashboard}
              className="flex items-center space-x-2 bg-white text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-50 transition shadow-lg font-semibold"
            >
              <Printer size={22} />
              <span>Print Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Products</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{numberFormatter.format(calculatedStats.totalProducts)}</p>
                <p className="text-sm text-gray-500 mt-1">In inventory</p>
              </div>
              <Package className="text-blue-500" size={40} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{currencyFormatter.format(calculatedStats.totalRevenue)}</p>
                <p className="text-sm text-gray-500 mt-1">Last 30 days</p>
              </div>
              <DollarSign className="text-green-500" size={40} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Low Stock Items</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{numberFormatter.format(calculatedStats.lowStockItems)}</p>
                <p className="text-sm text-gray-500 mt-1">Need reorder</p>
              </div>
              <AlertTriangle className="text-orange-500" size={40} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500 hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Expiring Soon</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{numberFormatter.format(calculatedStats.expiringSoon)}</p>
                <p className="text-sm text-gray-500 mt-1">Next 3 months</p>
              </div>
              <Calendar className="text-red-500" size={40} />
            </div>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Sales</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{numberFormatter.format(calculatedStats.totalSales)}</p>
                <p className="text-sm text-gray-500 mt-1">Transactions</p>
              </div>
              <ShoppingCart className="text-purple-500" size={40} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-cyan-500 hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Purchases</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{numberFormatter.format(calculatedStats.totalPurchases)}</p>
                <p className="text-sm text-gray-500 mt-1">Orders received</p>
              </div>
              <Activity className="text-cyan-500" size={40} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-amber-500 hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Stock Units</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{numberFormatter.format(calculatedStats.totalUnitsInStock)}</p>
                <p className="text-sm text-gray-500 mt-1">Total in stock</p>
              </div>
              <BarChart className="text-amber-500" size={40} />
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <TrendingUp className="text-blue-600 mr-3" size={28} />
              Top 5 Selling Products
            </h2>
            <span className="text-sm text-gray-500">Last 30 days</span>
          </div>
          
          {topProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No sales data available</p>
              <p className="text-gray-400 text-sm mt-2">Start making sales to see top products here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-4 text-gray-700 font-semibold">Rank</th>
                    <th className="text-left py-4 px-4 text-gray-700 font-semibold">Product Name</th>
                    <th className="text-left py-4 px-4 text-gray-700 font-semibold">Category</th>
                    <th className="text-left py-4 px-4 text-gray-700 font-semibold">Total Sales</th>
                    <th className="text-left py-4 px-4 text-gray-700 font-semibold">Revenue Generated</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={product.name} className="border-b hover:bg-blue-50 transition">
                      <td className="py-4 px-4">
                        <span className={`text-2xl font-bold ${
                          index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-gray-400' : 
                          index === 2 ? 'text-orange-600' : 
                          'text-gray-600'
                        }`}>
                          #{index + 1}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-800">{product.name}</td>
                      <td className="py-4 px-4 text-gray-600">{product.category}</td>
                      <td className="py-4 px-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                          {numberFormatter.format(product.salesCount)} units
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-green-600 text-lg">
                        {currencyFormatter.format(product.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Low Stock Alerts */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="text-orange-500 mr-2" size={26} />
              Low Stock Alerts (≤ 20 units)
            </h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 text-2xl">✓</span>
                  </div>
                  <p className="text-gray-500 text-lg">All products well stocked</p>
                </div>
              ) : (
                lowStockProducts.map(product => (
                  <div key={product.id} className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500 hover:bg-orange-100 transition">
                    <div>
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-600">
                          Category: <span className="font-medium">{product.category}</span>
                        </span>
                        <span className="text-sm text-gray-600">
                          Price: <span className="font-medium">{currencyFormatter.format(product.salePrice)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-orange-600 font-bold text-2xl">{numberFormatter.format(product.stock)}</span>
                      <p className="text-xs text-gray-500">units left</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Expiring Soon Alerts */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Calendar className="text-red-500 mr-2" size={26} />
              Expiring Soon (Next 3 Months)
            </h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {expiringProducts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 text-2xl">✓</span>
                  </div>
                  <p className="text-gray-500 text-lg">No products expiring soon</p>
                </div>
              ) : (
                expiringProducts.map(product => (
                  <div key={product.id} className="flex justify-between items-center p-4 bg-red-50 rounded-lg border-l-4 border-red-500 hover:bg-red-100 transition">
                    <div>
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-600">
                          Stock: <span className="font-medium">{numberFormatter.format(product.stock)}</span>
                        </span>
                        <span className="text-sm text-gray-600">
                          Category: <span className="font-medium">{product.category}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-red-600 font-bold">
                        {new Date(product.expiryDate || '').toLocaleDateString()}
                      </span>
                      <p className="text-xs text-gray-500">expiry date</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Sales</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {sales.slice(0, 5).map(sale => (
                <div key={sale._id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{sale.invoiceNumber}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {sale.items?.[0]?.productName || 'Multiple items'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{currencyFormatter.format(sale.grandTotal ?? 0)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {sales.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No recent sales
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Purchases</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {purchases.slice(0, 5).map(purchase => (
                <div key={purchase._id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{purchase.invoiceNumber}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {purchase.supplierName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{currencyFormatter.format(purchase.grandTotal ?? 0)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {purchases.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No recent purchases
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-6">Financial Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-blue-200 text-sm font-medium mb-2">Total Stock Value</p>
              <p className="text-4xl font-bold">{currencyFormatter.format(calculatedStats.totalStockValue)}</p>
            </div>
            <div className="text-center bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-blue-200 text-sm font-medium mb-2">Average Product Price</p>
              <p className="text-4xl font-bold">{currencyFormatter.format(calculatedStats.averageProductPrice)}</p>
            </div>
            <div className="text-center bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-blue-200 text-sm font-medium mb-2">Total Units in Stock</p>
              <p className="text-4xl font-bold">{numberFormatter.format(calculatedStats.totalUnitsInStock)}</p>
            </div>
            <div className="text-center bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-blue-200 text-sm font-medium mb-2">Profit Margin*</p>
              <p className="text-4xl font-bold">
                {calculatedStats.totalRevenue > 0 ? 
                  `${((calculatedStats.totalRevenue - (calculatedStats.totalStockValue * 0.7)) / calculatedStats.totalRevenue * 100).toFixed(1)}%` 
                  : '0%'}
              </p>
            </div>
          </div>
          <p className="text-blue-200 text-xs mt-4 text-center">*Estimated based on 70% cost of goods</p>
        </div>
      </div>
    </div>
  );
};

export default MedicalStoreDashboard;


// "use client";
// import React, { useState, useEffect, useCallback } from 'react';
// import { Package, DollarSign, AlertTriangle, Calendar, TrendingUp, Printer, ShoppingCart, BarChart, RefreshCw, Loader, Activity, ArrowUpRight, Zap } from 'lucide-react';
// import api from '@/app/lib/axios';
// import { useAuth } from '@/app/hooks/useAuth';

// const MedicalStoreDashboard = () => {
//   const { token } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [stats, setStats] = useState({
//     totalProducts: 0,
//     totalRevenue: 0,
//     lowStockItems: 0,
//     expiringSoon: 0,
//     totalStockValue: 0,
//     averageProductPrice: 0,
//     totalUnitsInStock: 0,
//     totalPurchases: 0,
//     totalSales: 0,
//     todayRevenue: 0,
//     monthlyGrowth: 0
//   });
  
//   const [topProducts, setTopProducts] = useState([]);
//   const [lowStockProducts, setLowStockProducts] = useState([]);
//   const [expiringProducts, setExpiringProducts] = useState([]);
//   const [recentSales, setRecentSales] = useState([]);
//   const [recentPurchases, setRecentPurchases] = useState([]);

//   // Fetch all data
//   const fetchDashboardData = useCallback(async () => {
//     if (!token) return;

//     setRefreshing(true);
    
//     try {
//       console.log("📊 Fetching dashboard data...");
      
//       // Fetch inventory
//       const inventoryRes = await api.get("/inventory", {
//         params: { limit: 1000 }
//       });
      
//       const inventoryData = inventoryRes.data.data || [];
//       console.log("📦 Inventory data:", inventoryData.length, "items");
      
//       // Fetch sales
//       const salesRes = await api.get("/sales", {
//         params: { limit: 1000, lastDays: 30 }
//       });
      
//       const salesData = salesRes.data.data?.sales || [];
//       console.log("💰 Sales data:", salesData.length, "transactions");
      
//       // Fetch purchases
//       const purchasesRes = await api.get("/purchases", {
//         params: { limit: 1000, lastDays: 30 }
//       });
      
//       const purchasesData = purchasesRes.data.data?.purchases || [];
//       console.log("🛒 Purchases data:", purchasesData.length, "orders");
      
//       // Calculate statistics
//       const calculatedStats = calculateStats(inventoryData, salesData, purchasesData);
//       setStats(calculatedStats);
      
//       // Calculate top selling products
//       const calculatedTopProducts = calculateTopProducts(salesData, inventoryData);
//       setTopProducts(calculatedTopProducts);
      
//       // Calculate low stock products
//       const calculatedLowStockProducts = calculateLowStockProducts(inventoryData);
//       setLowStockProducts(calculatedLowStockProducts);
      
//       // Calculate expiring products
//       const calculatedExpiringProducts = calculateExpiringProducts(inventoryData);
//       setExpiringProducts(calculatedExpiringProducts);
      
//       // Set recent activity
//       setRecentSales(salesData.slice(0, 5));
//       setRecentPurchases(purchasesData.slice(0, 5));
      
//     } catch (error) {
//       console.error("❌ Error fetching dashboard data:", error);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, [token]);

//   // Calculate statistics
//   const calculateStats = (inventoryData, salesData, purchasesData) => {
//     // Total products
//     const totalProducts = inventoryData.length;
    
//     // Calculate revenue for last 30 days
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
//     const totalRevenue = salesData.reduce((sum, sale) => {
//       const saleDate = new Date(sale.createdAt);
//       if (saleDate >= thirtyDaysAgo) {
//         return sum + (sale.grandTotal || 0);
//       }
//       return sum;
//     }, 0);
    
//     // Calculate today's revenue
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const todayRevenue = salesData.reduce((sum, sale) => {
//       const saleDate = new Date(sale.createdAt);
//       if (saleDate >= today) {
//         return sum + (sale.grandTotal || 0);
//       }
//       return sum;
//     }, 0);
    
//     // Low stock items (stock ≤ 20)
//     const lowStockItems = inventoryData.filter(item => (item.stock || 0) <= 20).length;
    
//     // Expiring soon (within 3 months)
//     const threeMonthsLater = new Date();
//     threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
//     const expiringSoon = inventoryData.filter(item => {
//       if (!item.expiry) return false;
//       const expiryDate = new Date(item.expiry);
//       return expiryDate <= threeMonthsLater && expiryDate >= new Date();
//     }).length;
    
//     // Total stock value
//     const totalStockValue = inventoryData.reduce((sum, item) => {
//       const costPrice = item.costPrice || item.price || 0;
//       const stock = item.stock || 0;
//       return sum + (costPrice * stock);
//     }, 0);
    
//     // Average product price
//     const averageProductPrice = inventoryData.length > 0 
//       ? inventoryData.reduce((sum, item) => sum + (item.salePrice || item.price || 0), 0) / inventoryData.length 
//       : 0;
    
//     // Total units in stock
//     const totalUnitsInStock = inventoryData.reduce((sum, item) => sum + (item.stock || 0), 0);
    
//     // Total purchases count
//     const totalPurchases = purchasesData.length;
    
//     // Total sales count
//     const totalSales = salesData.length;
    
//     // Calculate monthly growth (simplified)
//     const lastMonthRevenue = totalRevenue * 0.85; // 85% of current for demo
//     const monthlyGrowth = ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    
//     return {
//       totalProducts,
//       totalRevenue,
//       lowStockItems,
//       expiringSoon,
//       totalStockValue,
//       averageProductPrice,
//       totalUnitsInStock,
//       totalPurchases,
//       totalSales,
//       todayRevenue,
//       monthlyGrowth: Math.round(monthlyGrowth * 10) / 10 // Round to 1 decimal
//     };
//   };

//   // Calculate top selling products
//   const calculateTopProducts = (salesData, inventoryData) => {
//     const productSalesMap = {};
    
//     // Process sales data
//     salesData.forEach(sale => {
//       if (sale.items && Array.isArray(sale.items)) {
//         sale.items.forEach(item => {
//           const productName = item.productName;
//           const inventoryId = item.inventoryId?._id;
          
//           // Find product category from inventory
//           let category = 'Unknown';
//           if (inventoryId) {
//             const inventoryItem = inventoryData.find(p => p._id === inventoryId);
//             if (inventoryItem) {
//               category = inventoryItem.category || 'Unknown';
//             }
//           }
          
//           if (!productSalesMap[productName]) {
//             productSalesMap[productName] = {
//               name: productName,
//               salesCount: 0,
//               revenue: 0,
//               category: category
//             };
//           }
//           productSalesMap[productName].salesCount += item.quantity || 1;
//           productSalesMap[productName].revenue += item.total || item.unitPrice || 0;
//         });
//       }
//     });
    
//     // Convert to array and sort
//     const products = Object.values(productSalesMap)
//       .sort((a, b) => b.salesCount - a.salesCount)
//       .slice(0, 5);
    
//     // If no sales data, show inventory items sorted by stock (as fallback)
//     if (products.length === 0) {
//       return inventoryData
//         .sort((a, b) => (b.stock || 0) - (a.stock || 0))
//         .slice(0, 5)
//         .map(item => ({
//           name: item.name,
//           category: item.category || 'Unknown',
//           salesCount: 0,
//           revenue: 0
//         }));
//     }
    
//     return products;
//   };

//   // Calculate low stock products
//   const calculateLowStockProducts = (inventoryData) => {
//     return inventoryData
//       .filter(item => (item.stock || 0) <= 20)
//       .map(item => ({
//         id: item._id,
//         name: item.name,
//         category: item.category || 'Unknown',
//         stock: item.stock || 0,
//         salePrice: item.salePrice || item.price || 0
//       }))
//       .slice(0, 5); // Limit to 5 items
//   };

//   // Calculate expiring products
//   const calculateExpiringProducts = (inventoryData) => {
//     const threeMonthsLater = new Date();
//     threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    
//     return inventoryData
//       .filter(item => {
//         if (!item.expiry) return false;
//         const expiryDate = new Date(item.expiry);
//         return expiryDate <= threeMonthsLater && expiryDate >= new Date();
//       })
//       .sort((a, b) => new Date(a.expiry) - new Date(b.expiry)) // Sort by soonest expiry
//       .map(item => ({
//         id: item._id,
//         name: item.name,
//         category: item.category || 'Unknown',
//         stock: item.stock || 0,
//         expiryDate: item.expiry,
//         salePrice: item.salePrice || item.price || 0
//       }))
//       .slice(0, 5); // Limit to 5 items
//   };

//   // Initial fetch
//   useEffect(() => {
//     if (token) {
//       fetchDashboardData();
//     }
//   }, [token, fetchDashboardData]);

//   const printDashboard = () => {
//     window.print();
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
//           <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//       {/* Modern Header */}
//       <div className="bg-white shadow-lg border-b-4 border-gradient-to-r from-blue-500 to-purple-500">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
//                 <Zap className="w-8 h-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                   Medical Store Dashboard
//                 </h1>
//                 <p className="text-gray-600 mt-1 text-sm sm:text-base">
//                   Real-time Analytics & Inventory Management
//                 </p>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={fetchDashboardData}
//                 disabled={refreshing}
//                 className="flex items-center gap-2 px-5 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm disabled:opacity-50"
//               >
//                 <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
//                 <span className="font-medium">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
//               </button>
//               <button
//                 onClick={printDashboard}
//                 className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
//               >
//                 <Printer className="w-4 h-4" />
//                 <span className="font-medium">Print Report</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
//         {/* Hero Stats - Vibrant Gradient Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {/* Revenue Card */}
//           <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
//             <div className="relative">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
//                   <DollarSign className="w-7 h-7 text-white" />
//                 </div>
//                 <div className="flex items-center gap-1 text-white text-sm font-bold bg-white/25 px-3 py-1.5 rounded-full">
//                   <ArrowUpRight className="w-4 h-4" />
//                   {stats.monthlyGrowth > 0 ? '+' : ''}{stats.monthlyGrowth}%
//                 </div>
//               </div>
//               <p className="text-emerald-50 text-sm font-semibold mb-2">Total Revenue</p>
//               <p className="text-4xl font-black text-white mb-1">
//                 ${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
//               </p>
//               <p className="text-emerald-100 text-xs font-medium">
//                 Today: ${stats.todayRevenue.toFixed(2)}
//               </p>
//             </div>
//           </div>

//           {/* Products Card */}
//           <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
//             <div className="relative">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
//                   <Package className="w-7 h-7 text-white" />
//                 </div>
//                 <div className="text-white text-sm font-bold bg-white/25 px-3 py-1.5 rounded-full">
//                   Active
//                 </div>
//               </div>
//               <p className="text-blue-50 text-sm font-semibold mb-2">Total Products</p>
//               <p className="text-4xl font-black text-white mb-1">{stats.totalProducts}</p>
//               <p className="text-blue-100 text-xs font-medium">
//                 {stats.totalUnitsInStock.toLocaleString()} units in stock
//               </p>
//             </div>
//           </div>

//           {/* Low Stock Card */}
//           <div className="group relative overflow-hidden bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
//             <div className="relative">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
//                   <AlertTriangle className="w-7 h-7 text-white" />
//                 </div>
//                 <div className="text-white text-sm font-bold bg-white/25 px-3 py-1.5 rounded-full">
//                   {stats.lowStockItems > 0 ? 'Alert' : 'Good'}
//                 </div>
//               </div>
//               <p className="text-orange-50 text-sm font-semibold mb-2">Low Stock Items</p>
//               <p className="text-4xl font-black text-white mb-1">{stats.lowStockItems}</p>
//               <p className="text-orange-100 text-xs font-medium">
//                 {stats.lowStockItems > 0 ? 'Requires attention' : 'All well stocked'}
//               </p>
//             </div>
//           </div>

//           {/* Expiring Card */}
//           <div className="group relative overflow-hidden bg-gradient-to-br from-pink-400 to-rose-500 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
//             <div className="relative">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
//                   <Calendar className="w-7 h-7 text-white" />
//                 </div>
//                 <div className="text-white text-sm font-bold bg-white/25 px-3 py-1.5 rounded-full">
//                   {stats.expiringSoon > 0 ? 'Urgent' : 'Clear'}
//                 </div>
//               </div>
//               <p className="text-pink-50 text-sm font-semibold mb-2">Expiring Soon</p>
//               <p className="text-4xl font-black text-white mb-1">{stats.expiringSoon}</p>
//               <p className="text-pink-100 text-xs font-medium">Next 3 months</p>
//             </div>
//           </div>
//         </div>

//         {/* Secondary Stats */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Sales */}
//           <div className="bg-white border-2 border-purple-100 rounded-2xl p-5 hover:border-purple-300 hover:shadow-lg transition-all">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
//                 <ShoppingCart className="w-6 h-6 text-purple-600" />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Total Sales</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
//                 <p className="text-xs text-gray-400">Last 30 days</p>
//               </div>
//             </div>
//           </div>

//           {/* Purchases */}
//           <div className="bg-white border-2 border-cyan-100 rounded-2xl p-5 hover:border-cyan-300 hover:shadow-lg transition-all">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
//                 <Activity className="w-6 h-6 text-cyan-600" />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Purchases</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.totalPurchases}</p>
//                 <p className="text-xs text-gray-400">Last 30 days</p>
//               </div>
//             </div>
//           </div>

//           {/* Stock Value */}
//           <div className="bg-white border-2 border-indigo-100 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-lg transition-all">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
//                 <BarChart className="w-6 h-6 text-indigo-600" />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Stock Value</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   ${(stats.totalStockValue / 1000).toFixed(1)}k
//                 </p>
//                 <p className="text-xs text-gray-400">Total inventory value</p>
//               </div>
//             </div>
//           </div>

//           {/* Average Price */}
//           <div className="bg-white border-2 border-emerald-100 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-lg transition-all">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
//                 <TrendingUp className="w-6 h-6 text-emerald-600" />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Avg. Price</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   ${stats.averageProductPrice.toFixed(2)}
//                 </p>
//                 <p className="text-xs text-gray-400">Per product</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Top Products */}
//           <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
//                   <TrendingUp className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-white">Top Selling Products</h2>
//                   <p className="text-blue-100 text-sm mt-1">Best performers in the last 30 days</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="p-6">
//               {topProducts.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Package className="w-8 h-8 text-gray-400" />
//                   </div>
//                   <p className="text-gray-500 text-lg">No sales data available</p>
//                   <p className="text-gray-400 text-sm mt-2">Start making sales to see top products here</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {topProducts.map((product, index) => (
//                     <div key={product.name} className="group bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-purple-50 border-2 border-gray-100 hover:border-blue-200 rounded-2xl p-5 transition-all duration-300">
//                       <div className="flex items-center gap-4">
//                         <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg ${
//                           index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' : 
//                           index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' : 
//                           index === 2 ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white' : 
//                           'bg-gradient-to-br from-blue-400 to-purple-500 text-white'
//                         }`}>
//                           {index + 1}
//                         </div>
//                         <div className="flex-1">
//                           <p className="font-bold text-gray-900 text-lg">{product.name}</p>
//                           <p className="text-gray-500 text-sm mt-1">{product.category}</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-bold text-emerald-600 text-xl">
//                             ${product.revenue.toFixed(2)}
//                           </p>
//                           <p className="text-gray-500 text-sm mt-1">
//                             {product.salesCount} units sold
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Financial Summary */}
//           <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-xl overflow-hidden">
//             <div className="p-6 border-b border-white/20">
//               <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
//                 <DollarSign className="w-6 h-6 text-white" />
//               </div>
//               <h2 className="text-2xl font-bold text-white">Financial Overview</h2>
//               <p className="text-purple-100 text-sm mt-2">Key metrics at a glance</p>
//             </div>
//             <div className="p-6 space-y-4">
//               <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border-2 border-white/30">
//                 <p className="text-purple-100 text-sm font-semibold mb-2">Total Stock Value</p>
//                 <p className="text-3xl font-black text-white">
//                   ${stats.totalStockValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
//                 </p>
//               </div>
//               <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border-2 border-white/30">
//                 <p className="text-purple-100 text-sm font-semibold mb-2">Profit Margin</p>
//                 <p className="text-3xl font-black text-white">
//                   {stats.totalRevenue > 0 ? 
//                     `${((stats.totalRevenue - (stats.totalStockValue * 0.7)) / stats.totalRevenue * 100).toFixed(1)}%` 
//                     : '0%'}
//                 </p>
//                 <p className="text-purple-200 text-xs mt-2">Estimated based on 70% COGS</p>
//               </div>
//               <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border-2 border-white/30">
//                 <p className="text-purple-100 text-sm font-semibold mb-2">Units Available</p>
//                 <p className="text-3xl font-black text-white">
//                   {stats.totalUnitsInStock.toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Alerts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Low Stock */}
//           <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
//             <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
//                   <AlertTriangle className="w-6 h-6 text-white" />
//                 </div>
//                 <h2 className="text-xl font-bold text-white">Low Stock Alerts (≤ 20 units)</h2>
//               </div>
//             </div>
//             <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
//               {lowStockProducts.length === 0 ? (
//                 <div className="text-center py-8">
//                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                     <span className="text-green-600 text-2xl">✓</span>
//                   </div>
//                   <p className="text-gray-500 text-lg">All products well stocked</p>
//                   <p className="text-gray-400 text-sm mt-2">No low stock alerts</p>
//                 </div>
//               ) : (
//                 lowStockProducts.map(product => (
//                   <div key={product.id} className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 hover:border-orange-400 rounded-2xl p-4 transition-all">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-bold text-gray-900 text-lg">{product.name}</p>
//                         <p className="text-gray-600 text-sm mt-1">
//                           {product.category} • ${product.salePrice.toFixed(2)}
//                         </p>
//                       </div>
//                       <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold px-5 py-2 rounded-xl text-lg shadow-lg">
//                         {product.stock}
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Expiring */}
//           <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
//             <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
//                   <Calendar className="w-6 h-6 text-white" />
//                 </div>
//                 <h2 className="text-xl font-bold text-white">Expiring Soon (Next 3 Months)</h2>
//               </div>
//             </div>
//             <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
//               {expiringProducts.length === 0 ? (
//                 <div className="text-center py-8">
//                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                     <span className="text-green-600 text-2xl">✓</span>
//                   </div>
//                   <p className="text-gray-500 text-lg">No products expiring soon</p>
//                   <p className="text-gray-400 text-sm mt-2">All products have sufficient shelf life</p>
//                 </div>
//               ) : (
//                 expiringProducts.map(product => (
//                   <div key={product.id} className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 hover:border-red-400 rounded-2xl p-4 transition-all">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-bold text-gray-900 text-lg">{product.name}</p>
//                         <p className="text-gray-600 text-sm mt-1">
//                           {product.stock} units • {product.category}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-lg">
//                           {new Date(product.expiryDate).toLocaleDateString('en-US', { 
//                             month: 'short', 
//                             day: 'numeric',
//                             year: 'numeric'
//                           })}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Sales */}
//           <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
//             <div className="p-6 border-b-2 border-gray-100 bg-gradient-to-r from-gray-50 to-white">
//               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                 <ShoppingCart className="w-6 h-6 text-emerald-600" />
//                 Recent Sales
//               </h2>
//             </div>
//             <div className="divide-y-2 divide-gray-100">
//               {recentSales.length === 0 ? (
//                 <div className="p-8 text-center">
//                   <p className="text-gray-500">No recent sales</p>
//                 </div>
//               ) : (
//                 recentSales.map(sale => (
//                   <div key={sale._id} className="p-5 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-bold text-gray-900">{sale.invoiceNumber}</p>
//                         <p className="text-gray-600 text-sm mt-1">
//                           {sale.items?.[0]?.productName || 'Multiple items'}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-bold text-emerald-600 text-lg">
//                           ${sale.grandTotal?.toFixed(2)}
//                         </p>
//                         <p className="text-gray-500 text-xs mt-1">
//                           {new Date(sale.createdAt).toLocaleDateString('en-US', { 
//                             month: 'short', 
//                             day: 'numeric' 
//                           })}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Purchases */}
//           <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
//             <div className="p-6 border-b-2 border-gray-100 bg-gradient-to-r from-gray-50 to-white">
//               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                 <Activity className="w-6 h-6 text-blue-600" />
//                 Recent Purchases
//               </h2>
//             </div>
//             <div className="divide-y-2 divide-gray-100">
//               {recentPurchases.length === 0 ? (
//                 <div className="p-8 text-center">
//                   <p className="text-gray-500">No recent purchases</p>
//                 </div>
//               ) : (
//                 recentPurchases.map(purchase => (
//                   <div key={purchase._id} className="p-5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-bold text-gray-900">{purchase.invoiceNumber}</p>
//                         <p className="text-gray-600 text-sm mt-1">{purchase.supplierName}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-bold text-blue-600 text-lg">
//                           ${purchase.grandTotal?.toFixed(2)}
//                         </p>
//                         <p className="text-gray-500 text-xs mt-1">
//                           {new Date(purchase.createdAt).toLocaleDateString('en-US', { 
//                             month: 'short', 
//                             day: 'numeric' 
//                           })}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MedicalStoreDashboard;

// "use client";
// import React, { useMemo, useState } from 'react';
// import { 
//   Package, DollarSign, AlertTriangle, Calendar, 
//   TrendingUp, Printer, ShoppingCart, BarChart, 
//   RefreshCw, Loader, Activity, ArrowUpRight, Zap 
// } from 'lucide-react';
// import { useDashboardData, useAppData } from '@/app/hooks/useApiData';
// import { useQueryClient } from '@tanstack/react-query';

// const MedicalStoreDashboard = () => {
//   const queryClient = useQueryClient();
//   const { stats, products, sales, purchases } = useDashboardData();
//   const { isFetching, isPreviousData, refreshAll } = useAppData();

//   // Calculate derived data with useMemo for performance
//   const topProducts = useMemo(() => {
//     const productSalesMap = {};
    
//     sales.forEach(sale => {
//       if (sale.items && Array.isArray(sale.items)) {
//         sale.items.forEach(item => {
//           const productName = item.productName;
//           if (!productSalesMap[productName]) {
//             productSalesMap[productName] = {
//               name: productName,
//               salesCount: 0,
//               revenue: 0,
//               category: 'Unknown'
//             };
//           }
//           productSalesMap[productName].salesCount += item.quantity || 1;
//           productSalesMap[productName].revenue += item.total || item.unitPrice || 0;
//         });
//       }
//     });
    
//     return Object.values(productSalesMap)
//       .sort((a, b) => b.salesCount - a.salesCount)
//       .slice(0, 5);
//   }, [sales]);

//   const lowStockProducts = useMemo(() => 
//     products
//       .filter(item => (item.stock || 0) <= 20)
//       .slice(0, 5)
//       .map(item => ({
//         id: item._id,
//         name: item.name,
//         category: item.category || 'Unknown',
//         stock: item.stock || 0,
//         salePrice: item.salePrice || item.price || 0
//       })), 
//     [products]
//   );

//   const expiringProducts = useMemo(() => {
//     const threeMonthsLater = new Date();
//     threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    
//     return products
//       .filter(item => {
//         if (!item.expiry) return false;
//         const expiryDate = new Date(item.expiry);
//         return expiryDate <= threeMonthsLater && expiryDate >= new Date();
//       })
//       .slice(0, 5)
//       .map(item => ({
//         id: item._id,
//         name: item.name,
//         category: item.category || 'Unknown',
//         stock: item.stock || 0,
//         expiryDate: item.expiry,
//         salePrice: item.salePrice || item.price || 0
//       }));
//   }, [products]);

//   const recentSales = useMemo(() => 
//     [...sales]
//       .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//       .slice(0, 5), 
//     [sales]
//   );

//   const recentPurchases = useMemo(() => 
//     [...purchases]
//       .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//       .slice(0, 5), 
//     [purchases]
//   );

//   // Calculate today's revenue
//   const todayRevenue = useMemo(() => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     return sales.reduce((sum, sale) => {
//       const saleDate = new Date(sale.createdAt);
//       if (saleDate >= today) {
//         return sum + (sale.grandTotal || 0);
//       }
//       return sum;
//     }, 0);
//   }, [sales]);

//   // Calculate monthly growth (simplified)
//   const monthlyGrowth = useMemo(() => {
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
//     const totalRevenue = sales.reduce((sum, sale) => {
//       const saleDate = new Date(sale.createdAt);
//       if (saleDate >= thirtyDaysAgo) {
//         return sum + (sale.grandTotal || 0);
//       }
//       return sum;
//     }, 0);
    
//     const lastMonthRevenue = totalRevenue * 0.85; // 85% of current for demo
//     return Math.round(((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 * 10) / 10;
//   }, [sales]);

//   // Refresh all data
//   const refreshDashboard = () => {
//     refreshAll();
//   };

//   // Print dashboard
//   const printDashboard = () => {
//     window.print();
//   };

//   // Loading state
//   if (isFetching && products.length === 0 && sales.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto" />
//           <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//       {/* Modern Header */}
//       <div className="bg-white shadow-lg border-b-4 border-gradient-to-r from-blue-500 to-purple-500">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
//                 <Zap className="w-8 h-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                   Medical Store Dashboard
//                 </h1>
//                 <p className="text-gray-600 mt-1 text-sm sm:text-base">
//                   Real-time Analytics & Inventory Management
//                 </p>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={refreshDashboard}
//                 disabled={isFetching}
//                 className="flex items-center gap-2 px-5 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm disabled:opacity-50"
//               >
//                 <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
//                 <span className="font-medium">{isFetching ? 'Refreshing...' : 'Refresh'}</span>
//               </button>
//               <button
//                 onClick={printDashboard}
//                 className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
//               >
//                 <Printer className="w-4 h-4" />
//                 <span className="font-medium">Print Report</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
//         {/* Loading Indicator */}
//         {isFetching && isPreviousData && (
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
//             <Loader className="w-4 h-4 text-blue-600 animate-spin" />
//             <span className="text-blue-700 text-sm">
//               Updating dashboard data...
//             </span>
//           </div>
//         )}

//         {/* Hero Stats - Vibrant Gradient Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {/* Revenue Card */}
//           <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
//             <div className="relative">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
//                   <DollarSign className="w-7 h-7 text-white" />
//                 </div>
//                 <div className="flex items-center gap-1 text-white text-sm font-bold bg-white/25 px-3 py-1.5 rounded-full">
//                   <ArrowUpRight className="w-4 h-4" />
//                   {monthlyGrowth > 0 ? '+' : ''}{monthlyGrowth}%
//                 </div>
//               </div>
//               <p className="text-emerald-50 text-sm font-semibold mb-2">Total Revenue</p>
//               <p className="text-4xl font-black text-white mb-1">
//                 ${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
//               </p>
//               <p className="text-emerald-100 text-xs font-medium">
//                 Today: ${todayRevenue.toFixed(2)}
//               </p>
//             </div>
//           </div>

//           {/* Products Card */}
//           <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
//             <div className="relative">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
//                   <Package className="w-7 h-7 text-white" />
//                 </div>
//                 <div className="text-white text-sm font-bold bg-white/25 px-3 py-1.5 rounded-full">
//                   Active
//                 </div>
//               </div>
//               <p className="text-blue-50 text-sm font-semibold mb-2">Total Products</p>
//               <p className="text-4xl font-black text-white mb-1">{stats.totalProducts}</p>
//               <p className="text-blue-100 text-xs font-medium">
//                 {stats.totalUnitsInStock.toLocaleString()} units in stock
//               </p>
//             </div>
//           </div>

//           {/* Low Stock Card */}
//           <div className="group relative overflow-hidden bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
//             <div className="relative">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
//                   <AlertTriangle className="w-7 h-7 text-white" />
//                 </div>
//                 <div className="text-white text-sm font-bold bg-white/25 px-3 py-1.5 rounded-full">
//                   {stats.lowStockItems > 0 ? 'Alert' : 'Good'}
//                 </div>
//               </div>
//               <p className="text-orange-50 text-sm font-semibold mb-2">Low Stock Items</p>
//               <p className="text-4xl font-black text-white mb-1">{stats.lowStockItems}</p>
//               <p className="text-orange-100 text-xs font-medium">
//                 {stats.lowStockItems > 0 ? 'Requires attention' : 'All well stocked'}
//               </p>
//             </div>
//           </div>

//           {/* Expiring Card */}
//           <div className="group relative overflow-hidden bg-gradient-to-br from-pink-400 to-rose-500 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
//             <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
//             <div className="relative">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
//                   <Calendar className="w-7 h-7 text-white" />
//                 </div>
//                 <div className="text-white text-sm font-bold bg-white/25 px-3 py-1.5 rounded-full">
//                   {stats.expiringSoon > 0 ? 'Urgent' : 'Clear'}
//                 </div>
//               </div>
//               <p className="text-pink-50 text-sm font-semibold mb-2">Expiring Soon</p>
//               <p className="text-4xl font-black text-white mb-1">{stats.expiringSoon}</p>
//               <p className="text-pink-100 text-xs font-medium">Next 3 months</p>
//             </div>
//           </div>
//         </div>

//         {/* Secondary Stats */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* Sales */}
//           <div className="bg-white border-2 border-purple-100 rounded-2xl p-5 hover:border-purple-300 hover:shadow-lg transition-all">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
//                 <ShoppingCart className="w-6 h-6 text-purple-600" />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Total Sales</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
//                 <p className="text-xs text-gray-400">Last 30 days</p>
//               </div>
//             </div>
//           </div>

//           {/* Purchases */}
//           <div className="bg-white border-2 border-cyan-100 rounded-2xl p-5 hover:border-cyan-300 hover:shadow-lg transition-all">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
//                 <Activity className="w-6 h-6 text-cyan-600" />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Purchases</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.totalPurchases}</p>
//                 <p className="text-xs text-gray-400">Last 30 days</p>
//               </div>
//             </div>
//           </div>

//           {/* Stock Value */}
//           <div className="bg-white border-2 border-indigo-100 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-lg transition-all">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
//                 <BarChart className="w-6 h-6 text-indigo-600" />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Stock Value</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   ${(stats.totalStockValue / 1000).toFixed(1)}k
//                 </p>
//                 <p className="text-xs text-gray-400">Total inventory value</p>
//               </div>
//             </div>
//           </div>

//           {/* Average Price */}
//           <div className="bg-white border-2 border-emerald-100 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-lg transition-all">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
//                 <TrendingUp className="w-6 h-6 text-emerald-600" />
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Avg. Price</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   ${stats.averageProductPrice.toFixed(2)}
//                 </p>
//                 <p className="text-xs text-gray-400">Per product</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Top Products */}
//           <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
//                   <TrendingUp className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h2 className="text-2xl font-bold text-white">Top Selling Products</h2>
//                   <p className="text-blue-100 text-sm mt-1">Best performers in the last 30 days</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="p-6">
//               {topProducts.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Package className="w-8 h-8 text-gray-400" />
//                   </div>
//                   <p className="text-gray-500 text-lg">No sales data available</p>
//                   <p className="text-gray-400 text-sm mt-2">Start making sales to see top products here</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {topProducts.map((product, index) => (
//                     <div key={product.name} className="group bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-purple-50 border-2 border-gray-100 hover:border-blue-200 rounded-2xl p-5 transition-all duration-300">
//                       <div className="flex items-center gap-4">
//                         <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg ${
//                           index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' : 
//                           index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' : 
//                           index === 2 ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white' : 
//                           'bg-gradient-to-br from-blue-400 to-purple-500 text-white'
//                         }`}>
//                           {index + 1}
//                         </div>
//                         <div className="flex-1">
//                           <p className="font-bold text-gray-900 text-lg">{product.name}</p>
//                           <p className="text-gray-500 text-sm mt-1">{product.category}</p>
//                         </div>
//                         <div className="text-right">
//                           <p className="font-bold text-emerald-600 text-xl">
//                             ${product.revenue.toFixed(2)}
//                           </p>
//                           <p className="text-gray-500 text-sm mt-1">
//                             {product.salesCount} units sold
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Financial Summary */}
//           <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-xl overflow-hidden">
//             <div className="p-6 border-b border-white/20">
//               <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
//                 <DollarSign className="w-6 h-6 text-white" />
//               </div>
//               <h2 className="text-2xl font-bold text-white">Financial Overview</h2>
//               <p className="text-purple-100 text-sm mt-2">Key metrics at a glance</p>
//             </div>
//             <div className="p-6 space-y-4">
//               <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border-2 border-white/30">
//                 <p className="text-purple-100 text-sm font-semibold mb-2">Total Stock Value</p>
//                 <p className="text-3xl font-black text-white">
//                   ${stats.totalStockValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
//                 </p>
//               </div>
//               <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border-2 border-white/30">
//                 <p className="text-purple-100 text-sm font-semibold mb-2">Profit Margin</p>
//                 <p className="text-3xl font-black text-white">
//                   {stats.totalRevenue > 0 ? 
//                     `${((stats.totalRevenue - (stats.totalStockValue * 0.7)) / stats.totalRevenue * 100).toFixed(1)}%` 
//                     : '0%'}
//                 </p>
//                 <p className="text-purple-200 text-xs mt-2">Estimated based on 70% COGS</p>
//               </div>
//               <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border-2 border-white/30">
//                 <p className="text-purple-100 text-sm font-semibold mb-2">Units Available</p>
//                 <p className="text-3xl font-black text-white">
//                   {stats.totalUnitsInStock.toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Alerts Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Low Stock */}
//           <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
//             <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
//                   <AlertTriangle className="w-6 h-6 text-white" />
//                 </div>
//                 <h2 className="text-xl font-bold text-white">Low Stock Alerts (≤ 20 units)</h2>
//               </div>
//             </div>
//             <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
//               {lowStockProducts.length === 0 ? (
//                 <div className="text-center py-8">
//                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                     <span className="text-green-600 text-2xl">✓</span>
//                   </div>
//                   <p className="text-gray-500 text-lg">All products well stocked</p>
//                   <p className="text-gray-400 text-sm mt-2">No low stock alerts</p>
//                 </div>
//               ) : (
//                 lowStockProducts.map(product => (
//                   <div key={product.id} className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 hover:border-orange-400 rounded-2xl p-4 transition-all">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-bold text-gray-900 text-lg">{product.name}</p>
//                         <p className="text-gray-600 text-sm mt-1">
//                           {product.category} • ${product.salePrice.toFixed(2)}
//                         </p>
//                       </div>
//                       <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold px-5 py-2 rounded-xl text-lg shadow-lg">
//                         {product.stock}
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Expiring */}
//           <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
//             <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
//                   <Calendar className="w-6 h-6 text-white" />
//                 </div>
//                 <h2 className="text-xl font-bold text-white">Expiring Soon (Next 3 Months)</h2>
//               </div>
//             </div>
//             <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
//               {expiringProducts.length === 0 ? (
//                 <div className="text-center py-8">
//                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                     <span className="text-green-600 text-2xl">✓</span>
//                   </div>
//                   <p className="text-gray-500 text-lg">No products expiring soon</p>
//                   <p className="text-gray-400 text-sm mt-2">All products have sufficient shelf life</p>
//                 </div>
//               ) : (
//                 expiringProducts.map(product => (
//                   <div key={product.id} className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 hover:border-red-400 rounded-2xl p-4 transition-all">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-bold text-gray-900 text-lg">{product.name}</p>
//                         <p className="text-gray-600 text-sm mt-1">
//                           {product.stock} units • {product.category}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-lg">
//                           {new Date(product.expiryDate).toLocaleDateString('en-US', { 
//                             month: 'short', 
//                             day: 'numeric',
//                             year: 'numeric'
//                           })}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Sales */}
//           <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
//             <div className="p-6 border-b-2 border-gray-100 bg-gradient-to-r from-gray-50 to-white">
//               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                 <ShoppingCart className="w-6 h-6 text-emerald-600" />
//                 Recent Sales
//               </h2>
//             </div>
//             <div className="divide-y-2 divide-gray-100">
//               {recentSales.length === 0 ? (
//                 <div className="p-8 text-center">
//                   <p className="text-gray-500">No recent sales</p>
//                 </div>
//               ) : (
//                 recentSales.map(sale => (
//                   <div key={sale._id} className="p-5 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-bold text-gray-900">{sale.invoiceNumber}</p>
//                         <p className="text-gray-600 text-sm mt-1">
//                           {sale.items?.[0]?.productName || 'Multiple items'}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-bold text-emerald-600 text-lg">
//                           ${sale.grandTotal?.toFixed(2)}
//                         </p>
//                         <p className="text-gray-500 text-xs mt-1">
//                           {new Date(sale.createdAt).toLocaleDateString('en-US', { 
//                             month: 'short', 
//                             day: 'numeric' 
//                           })}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Purchases */}
//           <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden">
//             <div className="p-6 border-b-2 border-gray-100 bg-gradient-to-r from-gray-50 to-white">
//               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//                 <Activity className="w-6 h-6 text-blue-600" />
//                 Recent Purchases
//               </h2>
//             </div>
//             <div className="divide-y-2 divide-gray-100">
//               {recentPurchases.length === 0 ? (
//                 <div className="p-8 text-center">
//                   <p className="text-gray-500">No recent purchases</p>
//                 </div>
//               ) : (
//                 recentPurchases.map(purchase => (
//                   <div key={purchase._id} className="p-5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="font-bold text-gray-900">{purchase.invoiceNumber}</p>
//                         <p className="text-gray-600 text-sm mt-1">{purchase.supplierName}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-bold text-blue-600 text-lg">
//                           ${purchase.grandTotal?.toFixed(2)}
//                         </p>
//                         <p className="text-gray-500 text-xs mt-1">
//                           {new Date(purchase.createdAt).toLocaleDateString('en-US', { 
//                             month: 'short', 
//                             day: 'numeric' 
//                           })}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MedicalStoreDashboard;
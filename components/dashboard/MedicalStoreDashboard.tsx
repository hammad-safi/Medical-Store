"use client";
import React, { useState } from 'react';
import { Package, DollarSign, AlertTriangle, Calendar, TrendingUp, Printer } from 'lucide-react';

const MedicalStoreDashboard = () => {
  const [products] = useState([
    { id: 1, name: 'Paracetamol 500mg', category: 'Tablet', stock: 150, price: 5.50, reorderLevel: 50, expiryDate: '2025-08-15', supplier: 'PharmaCorp', sales: 245 },
    { id: 2, name: 'Amoxicillin 250mg', category: 'Capsule', stock: 80, price: 12.00, reorderLevel: 40, expiryDate: '2025-06-20', supplier: 'MediSupply', sales: 189 },
    { id: 3, name: 'Cough Syrup', category: 'Syrup', stock: 25, price: 8.75, reorderLevel: 30, expiryDate: '2025-03-10', supplier: 'HealthPlus', sales: 156 },
    { id: 4, name: 'Vitamin C 1000mg', category: 'Tablet', stock: 200, price: 15.00, reorderLevel: 60, expiryDate: '2026-01-30', supplier: 'VitaLife', sales: 312 },
    { id: 5, name: 'Insulin Injection', category: 'Injection', stock: 15, price: 45.00, reorderLevel: 20, expiryDate: '2025-02-28', supplier: 'PharmaCorp', sales: 98 },
    { id: 6, name: 'Aspirin 75mg', category: 'Tablet', stock: 180, price: 3.25, reorderLevel: 50, expiryDate: '2025-11-22', supplier: 'MediSupply', sales: 276 },
    { id: 7, name: 'Blood Pressure Monitor', category: 'Device', stock: 30, price: 85.00, reorderLevel: 15, expiryDate: '2027-05-14', supplier: 'MedTech', sales: 45 },
    { id: 8, name: 'Bandages Pack', category: 'Medical Supply', stock: 120, price: 6.50, reorderLevel: 40, expiryDate: '2026-09-30', supplier: 'HealthPlus', sales: 198 },
  ]);

  const [salesOrders] = useState([
    { id: 1, productName: 'Paracetamol 500mg', quantity: 10, customerName: 'John Doe', saleDate: '2024-12-14', totalAmount: 55 },
    { id: 2, productName: 'Amoxicillin 250mg', quantity: 5, customerName: 'Jane Smith', saleDate: '2024-12-15', totalAmount: 60 },
    { id: 3, productName: 'Vitamin C 1000mg', quantity: 8, customerName: 'Michael Brown', saleDate: '2024-12-15', totalAmount: 120 },
    { id: 4, productName: 'Cough Syrup', quantity: 3, customerName: 'Sarah Wilson', saleDate: '2024-12-14', totalAmount: 26.25 },
    { id: 5, productName: 'Aspirin 75mg', quantity: 12, customerName: 'David Lee', saleDate: '2024-12-13', totalAmount: 39 },
  ]);

  const getExpiringProducts = () => {
    const today = new Date();
    const threeMonthsLater = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
    return products.filter(p => new Date(p.expiryDate) <= threeMonthsLater);
  };

  const getLowStockProducts = () => {
    return products.filter(p => p.stock <= p.reorderLevel);
  };

  const getTopProducts = () => {
    return [...products].sort((a, b) => b.sales - a.sales).slice(0, 5);
  };

  const getTotalRevenue = () => {
    return salesOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  };

  const getTotalStockValue = () => {
    return products.reduce((sum, product) => sum + (product.stock * product.price), 0);
  };

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
              <p>${products.length}</p>
            </div>
            <div class="stat-box">
              <h3>Total Revenue</h3>
              <p>$${getTotalRevenue().toFixed(2)}</p>
            </div>
            <div class="stat-box">
              <h3>Low Stock Items</h3>
              <p>${getLowStockProducts().length}</p>
            </div>
            <div class="stat-box">
              <h3>Expiring Soon</h3>
              <p>${getExpiringProducts().length}</p>
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
              ${getTopProducts().map((p, i) => `
                <tr>
                  <td><strong>#${i + 1}</strong></td>
                  <td>${p.name}</td>
                  <td>${p.category}</td>
                  <td>${p.sales} units</td>
                  <td>$${(p.sales * p.price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2>Low Stock Alerts</h2>
          ${getLowStockProducts().length === 0 ? '<p>No low stock items</p>' : 
            getLowStockProducts().map(p => `
              <div class="alert">
                <strong>${p.name}</strong> - Current Stock: ${p.stock} | Reorder Level: ${p.reorderLevel}
              </div>
            `).join('')
          }

          <h2>Expiring Products (Next 3 Months)</h2>
          ${getExpiringProducts().length === 0 ? '<p>No products expiring soon</p>' : 
            getExpiringProducts().map(p => `
              <div class="alert expiry-alert">
                <strong>${p.name}</strong> - Expiry Date: ${p.expiryDate} | Stock: ${p.stock}
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
                <th>Price</th>
                <th>Stock Value</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => `
                <tr>
                  <td>${p.name}</td>
                  <td>${p.category}</td>
                  <td>${p.stock}</td>
                  <td>$${p.price.toFixed(2)}</td>
                  <td>$${(p.stock * p.price).toFixed(2)}</td>
                  <td>${p.expiryDate}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin-top: 30px; padding: 15px; background-color: #dbeafe; border-radius: 8px;">
            <strong>Total Stock Value: $${getTotalStockValue().toFixed(2)}</strong>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white p-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Medical Store Dashboard</h1>
            <p className="text-blue-100 mt-2 text-lg">Real-time inventory and sales analytics</p>
          </div>
          <button
            onClick={printDashboard}
            className="flex items-center space-x-2 bg-white text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-50 transition shadow-lg font-semibold"
          >
            <Printer size={22} />
            <span>Print Dashboard</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Products</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{products.length}</p>
                <p className="text-sm text-gray-500 mt-1">In inventory</p>
              </div>
              <Package className="text-blue-500" size={40} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">${getTotalRevenue().toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">From sales</p>
              </div>
              <DollarSign className="text-green-500" size={40} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Low Stock Items</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{getLowStockProducts().length}</p>
                <p className="text-sm text-gray-500 mt-1">Need reorder</p>
              </div>
              <AlertTriangle className="text-orange-500" size={40} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500 hover:shadow-xl transition">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Expiring Soon</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{getExpiringProducts().length}</p>
                <p className="text-sm text-gray-500 mt-1">Next 3 months</p>
              </div>
              <Calendar className="text-red-500" size={40} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <TrendingUp className="text-blue-600 mr-3" size={28} />
              Top 5 Selling Products
            </h2>
          </div>
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
                {getTopProducts().map((product, index) => (
                  <tr key={product.id} className="border-b hover:bg-blue-50 transition">
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
                        {product.sales} units
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-green-600 text-lg">
                      ${(product.sales * product.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="text-orange-500 mr-2" size={26} />
              Low Stock Alerts
            </h2>
            <div className="space-y-3">
              {getLowStockProducts().length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">✓ All products well stocked</p>
                </div>
              ) : (
                getLowStockProducts().map(product => (
                  <div key={product.id} className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500 hover:bg-orange-100 transition">
                    <div>
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Current: <span className="font-medium text-orange-600">{product.stock}</span> | 
                        Reorder: <span className="font-medium">{product.reorderLevel}</span>
                      </p>
                    </div>
                    <span className="text-orange-600 font-bold text-xl">{product.stock}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Calendar className="text-red-500 mr-2" size={26} />
              Expiring Soon (Next 3 Months)
            </h2>
            <div className="space-y-3">
              {getExpiringProducts().length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">✓ No products expiring soon</p>
                </div>
              ) : (
                getExpiringProducts().map(product => (
                  <div key={product.id} className="flex justify-between items-center p-4 bg-red-50 rounded-lg border-l-4 border-red-500 hover:bg-red-100 transition">
                    <div>
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Stock: <span className="font-medium">{product.stock}</span> | 
                        Supplier: <span className="font-medium">{product.supplier}</span>
                      </p>
                    </div>
                    <span className="text-red-600 font-bold">{product.expiryDate}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-blue-200 text-sm font-medium mb-2">Total Stock Value</p>
              <p className="text-4xl font-bold">${getTotalStockValue().toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-blue-200 text-sm font-medium mb-2">Average Product Price</p>
              <p className="text-4xl font-bold">
                ${(products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-blue-200 text-sm font-medium mb-2">Total Units in Stock</p>
              <p className="text-4xl font-bold">
                {products.reduce((sum, p) => sum + p.stock, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalStoreDashboard;
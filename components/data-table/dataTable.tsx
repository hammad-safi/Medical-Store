// // [file name]: dataTable.tsx
// // [file content begin]
// "use client";
// import { AlertCircle, Clock, Edit, Eye, Package, ShoppingCart } from "lucide-react";

// interface DataTableProps {
//   columns: { key: string; label: string }[];
//   data: any[];
//   selected: string[];
//   setSelected: (ids: string[]) => void;
//   onEdit?: (item: any) => void;
//   onView: (item: any) => void;
//   onSale?: (item: any) => void;     // ✅ NEW
//   showEdit?: boolean;
//   showSale?: boolean;
// }

// export default function DataTable({ 
//   columns, 
//   data, 
//   selected, 
//   setSelected, 
//   onEdit, 
//   onView,
//   showEdit = true 
// }: DataTableProps) {
//   const toggleRow = (id: string) =>
//     setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

//   const toggleAll = () =>
//     setSelected(selected.length === data.length ? [] : data.map((row) => row._id));

//   const getNestedValue = (obj: any, path: string) => {
//     return path.split('.').reduce((acc, key) => acc?.[key], obj);
//   };

//   if (!data.length) {
//     return (
//       <div className="bg-white rounded-xl border p-12 text-center">
//         <Package size={64} className="mx-auto text-gray-300 mb-4" />
//         <h3 className="text-xl font-bold text-gray-800 mb-2">No Data Found</h3>
//         <p className="text-gray-500">Try adjusting your search or filters</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl border shadow-sm overflow-auto">
//       <table className="min-w-full text-sm">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="p-4">
//               <input
//                 type="checkbox"
//                 checked={selected.length === data.length && data.length > 0}
//                 onChange={toggleAll}
//                 className="w-4 h-4 rounded border-gray-300 text-blue-600"
//               />
//             </th>
//             {columns.map((col) => (
//               <th key={col.key} className="p-4 text-left font-semibold text-gray-700">
//                 {col.label}
//               </th>
//             ))}
//             <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row) => {
//             const isLowStock = row.stock < 50;
//             const isExpiringSoon = row.expiry && new Date(row.expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

//             return (
//               <tr key={row._id} className="border-t hover:bg-gray-50">
//                 <td className="p-4">
//                   <input
//                     type="checkbox"
//                     checked={selected.includes(row._id)}
//                     onChange={() => toggleRow(row._id)}
//                     className="w-4 h-4 rounded border-gray-300 text-blue-600"
//                   />
//                 </td>
//                 {columns.map((col) => {
//                   const value = col.key.includes('.') 
//                     ? getNestedValue(row, col.key)
//                     : row[col.key];
                  
//                   if (col.key === 'stock') {
//                     return (
//                       <td key={col.key} className="p-4">
//                         <div className="flex items-center gap-2">
//                           <span className={`${isLowStock ? "text-red-600 font-bold" : "text-gray-900"}`}>
//                             {value}
//                           </span>
//                           {isLowStock && <AlertCircle size={16} className="text-red-500" />}
//                         </div>
//                       </td>
//                     );
//                   }

//                   if (col.key === 'expiry' || col.key.includes('expiry')) {
//                     return (
//                       <td key={col.key} className="p-4">
//                         <div className="flex items-center gap-2">
//                           <span className={`${isExpiringSoon ? "text-orange-600 font-semibold" : "text-gray-900"}`}>
//                             {value ? new Date(value).toLocaleDateString() : 'N/A'}
//                           </span>
//                           {isExpiringSoon && <Clock size={16} className="text-orange-500" />}
//                         </div>
//                       </td>
//                     );
//                   }

//                   if (col.key === 'salePrice' || col.key === 'costPrice') {
//                     return (
//                       <td key={col.key} className="p-4 font-bold text-green-600">
//                         ${typeof value === 'number' ? value.toFixed(2) : value}
//                       </td>
//                     );
//                   }

//                   if (col.key === 'total') {
//                     return (
//                       <td key={col.key} className="p-4 font-bold text-blue-600">
//                         ${value}
//                       </td>
//                     );
//                   }

//                   return (
//                     <td key={col.key} className="p-4">
//                       {value}
//                     </td>
//                   );
//                 })}
//                 {/* <td className="p-4 flex gap-2">
//                   <button
//                     onClick={() => onView(row)}
//                     className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
//                     title="View Details"
//                   >
//                     <Eye size={16} />
//                   </button>
//                   {showEdit && onEdit && (
//                     <button
//                       onClick={() => onEdit(row)}
//                       className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100"
//                       title="Edit"
//                     >
//                       <Edit size={16} />
//                     </button>
//                   )}
//                 </td> */}
//                 <td className="p-4 flex gap-2">
//   {/* View */}
//   <button
//     onClick={() => onView(row)}
//     className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
//     title="View"
//   >
//     <Eye size={16} />
//   </button>

//   {/* Edit */}
//   {showEdit && onEdit && (
//     <button
//       onClick={() => onEdit(row)}
//       className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100"
//       title="Edit"
//     >
//       <Edit size={16} />
//     </button>
//   )}

//   {/* Sale
//   {showSale && onSale && (
//     <button
//       onClick={() => onSale(row)}
//       className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
//       title="Sell Product"
//     >
//       <ShoppingCart size={16} />
//     </button> */}
//   {/* )} */}
// </td>

//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }

"use client";
import { AlertCircle, Clock, Edit, Eye, Package, ShoppingCart, TrendingUp, MoreVertical, ChevronRight } from "lucide-react";
import { useState } from "react";

interface DataTableProps {
  columns: { key: string; label: string; type?: 'text' | 'number' | 'date' | 'currency' | 'status' | 'action' }[];
  data: any[];
  selected: string[];
  setSelected: (ids: string[]) => void;
  onEdit?: (item: any) => void;
  onView: (item: any) => void;
  onQuickSale?: (item: any) => void;
  onQuickPurchase?: (item: any) => void;
  showEdit?: boolean;
  customActions?: (row: any) => React.ReactNode;
  showRowMenu?: boolean;
  rowMenuItems?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: (item: any) => void;
    variant?: 'default' | 'danger';
  }>;
}

export default function DataTable({ 
  columns, 
  data, 
  selected, 
  setSelected, 
  onEdit, 
  onView,
  onQuickSale,
  onQuickPurchase,
  showEdit = true,
  customActions,
  showRowMenu = false,
  rowMenuItems = []
}: DataTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);

  const toggleRow = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  // In the DataTable component, update the toggleAll function:
const toggleAll = () => {
  if (selected.length === data.length) {
    setSelected([]);
  } else {
    setSelected(data.map((row) => row._id));
  }
};

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  };

  const formatValue = (value: any, type?: string) => {
    if (value === null || value === undefined) return '-';
    
    switch (type) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'currency':
        return `$${parseFloat(value).toFixed(2)}`;
      case 'number':
        return Number(value).toLocaleString();
      case 'status':
        const statusColors: Record<string, string> = {
          'active': 'bg-green-100 text-green-800',
          'inactive': 'bg-red-100 text-red-800',
          'pending': 'bg-yellow-100 text-yellow-800',
          'completed': 'bg-blue-100 text-blue-800',
          'received': 'bg-green-100 text-green-800',
          'cancelled': 'bg-red-100 text-red-800',
          'partial': 'bg-yellow-100 text-yellow-800',
          'paid': 'bg-green-100 text-green-800',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[value.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      default:
        return value;
    }
  };

  if (!data.length) {
    return (
      <div className="bg-white rounded-xl border p-12 text-center">
        <Package size={64} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Data Found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="p-4 w-12">
                <input
                  type="checkbox"
                  checked={selected.length === data.length && data.length > 0}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className="p-4 text-left font-semibold text-gray-700 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const isLowStock = row.stock !== undefined && row.stock < 50;
              const isExpiringSoon = row.expiry && new Date(row.expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
              const isSelected = selected.includes(row._id);

              return (
                <React.Fragment key={row._id}>
                  <tr className={`border-t hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(row._id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    
                    {columns.map((col) => {
                      const value = col.key.includes('.') 
                        ? getNestedValue(row, col.key)
                        : row[col.key];
                      
                      if (col.key === 'stock') {
                        return (
                          <td key={col.key} className="p-4">
                            <div className="flex items-center gap-2">
                              <span className={`${isLowStock ? "text-red-600 font-bold" : "text-gray-900"}`}>
                                {value}
                              </span>
                              {isLowStock && <AlertCircle size={16} className="text-red-500" />}
                            </div>
                          </td>
                        );
                      }

                      if (col.key === 'expiry' || col.key.includes('expiry')) {
                        return (
                          <td key={col.key} className="p-4">
                            <div className="flex items-center gap-2">
                              <span className={`${isExpiringSoon ? "text-orange-600 font-semibold" : "text-gray-900"}`}>
                                {value ? new Date(value).toLocaleDateString() : 'N/A'}
                              </span>
                              {isExpiringSoon && <Clock size={16} className="text-orange-500" />}
                            </div>
                          </td>
                        );
                      }

                      if (col.key === 'salePrice' || col.key === 'costPrice' || col.key === 'unitPrice' || col.key === 'unitCost') {
                        return (
                          <td key={col.key} className="p-4 font-bold text-green-600">
                            ${typeof value === 'number' ? value.toFixed(2) : value}
                          </td>
                        );
                      }

                      if (col.key === 'total' || col.key === 'grandTotal' || col.key === 'totalAmount') {
                        return (
                          <td key={col.key} className="p-4 font-bold text-blue-600">
                            ${typeof value === 'number' ? value.toFixed(2) : value}
                          </td>
                        );
                      }

                      if (col.key === 'profitMargin') {
                        const margin = parseFloat(value) || 0;
                        return (
                          <td key={col.key} className="p-4">
                            <div className="flex items-center gap-1">
                              <TrendingUp size={14} className={margin >= 0 ? "text-green-500" : "text-red-500"} />
                              <span className={margin >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                {margin.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td key={col.key} className="p-4">
                          {formatValue(value, col.type)}
                        </td>
                      );
                    })}
                    
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onView(row)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        
                        {showEdit && onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        
                        {onQuickSale && (
                          <button
                            onClick={() => onQuickSale(row)}
                            className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                            title="Quick Sale"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                        
                        {onQuickPurchase && (
                          <button
                            onClick={() => onQuickPurchase(row)}
                            className="p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
                            title="Quick Purchase"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </button>
                        )}
                        
                        {customActions && customActions(row)}
                        
                        {showRowMenu && rowMenuItems.length > 0 && (
                          <div className="relative">
                            <button
                              onClick={() => setRowMenuOpen(rowMenuOpen === row._id ? null : row._id)}
                              className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                              title="More Actions"
                            >
                              <MoreVertical size={16} />
                            </button>
                            
                            {rowMenuOpen === row._id && (
                              <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-xl z-10 min-w-[160px]">
                                {rowMenuItems.map((item, index) => (
                                  <button
                                    key={index}
                                    onClick={() => {
                                      item.onClick(row);
                                      setRowMenuOpen(null);
                                    }}
                                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 ${
                                      item.variant === 'danger' ? 'text-red-600' : 'text-gray-700'
                                    } ${index > 0 ? 'border-t' : ''}`}
                                  >
                                    {item.icon}
                                    {item.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  
                  {expandedRow === row._id && row.items && (
                    <tr className="bg-gray-50">
                      <td colSpan={columns.length + 2}>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-700 mb-2">Items</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="p-2 text-left">Product</th>
                                  <th className="p-2 text-left">Quantity</th>
                                  <th className="p-2 text-left">Unit Price</th>
                                  <th className="p-2 text-left">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {row.items.map((item: any, index: number) => (
                                  <tr key={index} className="border-b">
                                    <td className="p-2">{item.productName}</td>
                                    <td className="p-2">{item.quantity}</td>
                                    <td className="p-2">${item.unitPrice?.toFixed(2)}</td>
                                    <td className="p-2 font-semibold">${item.totalCost?.toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer */}
      <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{data.length}</span> of <span className="font-semibold">{data.length}</span> entries
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rows per page:</span>
          <select className="text-sm border rounded px-2 py-1 bg-white">
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
// // [file content end]
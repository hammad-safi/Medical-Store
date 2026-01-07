// "use client";
// import { AlertCircle, Clock, Edit, Eye, Package, ShoppingCart, TrendingUp, MoreVertical, ChevronRight } from "lucide-react";
// import { useState } from "react";

// interface DataTableProps {
//   columns: { key: string; label: string; type?: 'text' | 'number' | 'date' | 'currency' | 'status' | 'action' }[];
//   data: any[];
//   selected: string[];
//   setSelected: (ids: string[]) => void;
//   onEdit?: (item: any) => void;
//   onView: (item: any) => void;
//   onQuickSale?: (item: any) => void;
//   onQuickPurchase?: (item: any) => void;
//   showEdit?: boolean;
//   customActions?: (row: any) => React.ReactNode;
//   showRowMenu?: boolean;
//   rowMenuItems?: Array<{
//     label: string;
//     icon?: React.ReactNode;
//     onClick: (item: any) => void;
//     variant?: 'default' | 'danger';
//   }>;
// }

// export default function DataTable({ 
//   columns, 
//   data, 
//   selected, 
//   setSelected, 
//   onEdit, 
//   onView,
//   onQuickSale,
//   onQuickPurchase,
//   showEdit = true,
//   customActions,
//   showRowMenu = false,
//   rowMenuItems = []
// }: DataTableProps) {
//   const [expandedRow, setExpandedRow] = useState<string | null>(null);
//   const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentData = data.slice(indexOfFirstRow, indexOfLastRow);

//   const toggleRow = (id: string) =>
//     setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

//   const toggleAll = () => {
//     const currentIds = currentData.map((row) => row._id);
//     const allSelected = currentIds.every((id) => selected.includes(id));
//     if (allSelected) {
//       setSelected(selected.filter((id) => !currentIds.includes(id)));
//     } else {
//       setSelected([...new Set([...selected, ...currentIds])]);
//     }
//   };

//   const getNestedValue = (obj: any, path: string) => {
//     return path.split('.').reduce((acc, key) => acc?.[key], obj);
//   };

//   const formatValue = (value: any, type?: string) => {
//     if (value === null || value === undefined) return '-';
    
//     switch (type) {
//       case 'date':
//         return new Date(value).toLocaleDateString();
//       case 'currency':
//         return `$${parseFloat(value).toFixed(2)}`;
//       case 'number':
//         return Number(value).toLocaleString();
//       case 'status':
//         const statusColors: Record<string, string> = {
//           'active': 'bg-green-100 text-green-800',
//           'inactive': 'bg-red-100 text-red-800',
//           'pending': 'bg-yellow-100 text-yellow-800',
//           'completed': 'bg-blue-100 text-blue-800',
//           'received': 'bg-green-100 text-green-800',
//           'cancelled': 'bg-red-100 text-red-800',
//           'partial': 'bg-yellow-100 text-yellow-800',
//           'paid': 'bg-green-100 text-green-800',
//         };
//         return (
//           <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[value.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
//             {value}
//           </span>
//         );
//       default:
//         return value;
//     }
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
//     <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
//             <tr>
//               <th className="p-4 w-12">
//                 <input
//                   type="checkbox"
//                   checked={currentData.length > 0 && currentData.every((row) => selected.includes(row._id))}
//                   onChange={toggleAll}
//                   className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//               </th>
//               {columns.map((col) => (
//                 <th 
//                   key={col.key} 
//                   className="p-4 text-left font-semibold text-gray-700 whitespace-nowrap"
//                 >
//                   {col.label}
//                 </th>
//               ))}
//               <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentData.map((row) => {
//               const isLowStock = row.stock !== undefined && row.stock < 50;
//               const isExpiringSoon = row.expiry && new Date(row.expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
//               const isSelected = selected.includes(row._id);

//               return (
//                 <React.Fragment key={row._id}>
//                   <tr className={`border-t hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
//                     <td className="p-4">
//                       <input
//                         type="checkbox"
//                         checked={isSelected}
//                         onChange={() => toggleRow(row._id)}
//                         className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                       />
//                     </td>
                    
//                     {columns.map((col) => {
//                       const value = col.key.includes('.') 
//                         ? getNestedValue(row, col.key)
//                         : row[col.key];
                      
//                       if (col.key === 'stock') {
//                         return (
//                           <td key={col.key} className="p-4">
//                             <div className="flex items-center gap-2">
//                               <span className={`${isLowStock ? "text-red-600 font-bold" : "text-gray-900"}`}>
//                                 {value}
//                               </span>
//                               {isLowStock && <AlertCircle size={16} className="text-red-500" />}
//                             </div>
//                           </td>
//                         );
//                       }

//                       if (col.key === 'expiry' || col.key.includes('expiry')) {
//                         return (
//                           <td key={col.key} className="p-4">
//                             <div className="flex items-center gap-2">
//                               <span className={`${isExpiringSoon ? "text-orange-600 font-semibold" : "text-gray-900"}`}>
//                                 {value ? new Date(value).toLocaleDateString() : 'N/A'}
//                               </span>
//                               {isExpiringSoon && <Clock size={16} className="text-orange-500" />}
//                             </div>
//                           </td>
//                         );
//                       }

//                       if (col.key === 'salePrice' || col.key === 'costPrice' || col.key === 'unitPrice' || col.key === 'unitCost') {
//                         return (
//                           <td key={col.key} className="p-4 font-bold text-green-600">
//                             ${typeof value === 'number' ? value.toFixed(2) : value}
//                           </td>
//                         );
//                       }

//                       if (col.key === 'total' || col.key === 'grandTotal' || col.key === 'totalAmount') {
//                         return (
//                           <td key={col.key} className="p-4 font-bold text-blue-600">
//                             ${typeof value === 'number' ? value.toFixed(2) : value}
//                           </td>
//                         );
//                       }

//                       if (col.key === 'profitMargin') {
//                         const margin = parseFloat(value) || 0;
//                         return (
//                           <td key={col.key} className="p-4">
//                             <div className="flex items-center gap-1">
//                               <TrendingUp size={14} className={margin >= 0 ? "text-green-500" : "text-red-500"} />
//                               <span className={margin >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
//                                 {margin.toFixed(1)}%
//                               </span>
//                             </div>
//                           </td>
//                         );
//                       }

//                       return (
//                         <td key={col.key} className="p-4">
//                           {formatValue(value, col.type)}
//                         </td>
//                       );
//                     })}
                    
//                     <td className="p-4">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => onView(row)}
//                           className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
//                           title="View Details"
//                         >
//                           <Eye size={16} />
//                         </button>
                        
//                         {showEdit && onEdit && (
//                           <button
//                             onClick={() => onEdit(row)}
//                             className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
//                             title="Edit"
//                           >
//                             <Edit size={16} />
//                           </button>
//                         )}
                        
//                         {onQuickSale && (
//                           <button
//                             onClick={() => onQuickSale(row)}
//                             className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
//                             title="Quick Sale"
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                           </button>
//                         )}
                        
//                         {onQuickPurchase && (
//                           <button
//                             onClick={() => onQuickPurchase(row)}
//                             className="p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
//                             title="Quick Purchase"
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//                             </svg>
//                           </button>
//                         )}
                        
//                         {customActions && customActions(row)}
                        
//                         {showRowMenu && rowMenuItems.length > 0 && (
//                           <div className="relative">
//                             <button
//                               onClick={() => setRowMenuOpen(rowMenuOpen === row._id ? null : row._id)}
//                               className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
//                               title="More Actions"
//                             >
//                               <MoreVertical size={16} />
//                             </button>
                            
//                             {rowMenuOpen === row._id && (
//                               <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-xl z-10 min-w-[160px]">
//                                 {rowMenuItems.map((item, index) => (
//                                   <button
//                                     key={index}
//                                     onClick={() => {
//                                       item.onClick(row);
//                                       setRowMenuOpen(null);
//                                     }}
//                                     className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 ${
//                                       item.variant === 'danger' ? 'text-red-600' : 'text-gray-700'
//                                     } ${index > 0 ? 'border-t' : ''}`}
//                                   >
//                                     {item.icon}
//                                     {item.label}
//                                   </button>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
                  
//                   {expandedRow === row._id && row.items && (
//                     <tr className="bg-gray-50">
//                       <td colSpan={columns.length + 2}>
//                         <div className="p-4">
//                           <h4 className="font-semibold text-gray-700 mb-2">Items</h4>
//                           <div className="overflow-x-auto">
//                             <table className="w-full text-sm">
//                               <thead>
//                                 <tr className="bg-gray-100">
//                                   <th className="p-2 text-left">Product</th>
//                                   <th className="p-2 text-left">Quantity</th>
//                                   <th className="p-2 text-left">Unit Price</th>
//                                   <th className="p-2 text-left">Total</th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {row.items.map((item: any, index: number) => (
//                                   <tr key={index} className="border-b">
//                                     <td className="p-2">{item.productName}</td>
//                                     <td className="p-2">{item.quantity}</td>
//                                     <td className="p-2">${item.unitPrice?.toFixed(2)}</td>
//                                     <td className="p-2 font-semibold">${item.totalCost?.toFixed(2)}</td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
      
//       {/* Table Footer */}
//       <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
//         <div className="text-sm text-gray-600">
//           Showing <span className="font-semibold">{(currentPage - 1) * rowsPerPage + 1}</span> to <span className="font-semibold">{Math.min(currentPage * rowsPerPage, data.length)}</span> of <span className="font-semibold">{data.length}</span> entries
//         </div>
//         <div className="flex items-center gap-6">
//           <div className="flex items-center gap-2">
//             <span className="text-sm text-gray-600">Rows per page:</span>
//             <select 
//               value={rowsPerPage}
//               onChange={(e) => {
//                 setRowsPerPage(Number(e.target.value));
//                 setCurrentPage(1);
//               }}
//               className="text-sm border rounded px-2 py-1 bg-white"
//             >
//               <option>10</option>
//               <option>25</option>
//               <option>50</option>
//               <option>100</option>
//             </select>
//           </div>
//           <div className="flex items-center gap-2">
//             <button 
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="px-3 py-1 rounded bg-white border text-gray-600 disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span className="text-sm text-gray-600">
//               Page {currentPage} of {Math.ceil(data.length / rowsPerPage)}
//             </span>
//             <button 
//               onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(data.length / rowsPerPage)))}
//               disabled={currentPage === Math.ceil(data.length / rowsPerPage)}
//               className="px-3 py-1 rounded bg-white border text-gray-600 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React from "react";

// "use client";
// import React from "react";
// import { AlertCircle, Clock, Edit, Eye, Package, ShoppingCart, TrendingUp, MoreVertical, ChevronRight } from "lucide-react";
// import { useState } from "react";

// interface DataTableProps {
//   columns: { key: string; label: string; type?: 'text' | 'number' | 'date' | 'currency' | 'status' | 'action' }[];
//   data: any[];
//   selected: string[];
//   setSelected: (ids: string[]) => void;
//   onEdit?: (item: any) => void;
//   onView: (item: any) => void;
//   onQuickSale?: (item: any) => void;
//   onQuickPurchase?: (item: any) => void;
//   showEdit?: boolean;
//   customActions?: (row: any) => React.ReactNode;
//   showRowMenu?: boolean;
//   rowMenuItems?: Array<{
//     label: string;
//     icon?: React.ReactNode;
//     onClick: (item: any) => void;
//     variant?: 'default' | 'danger';
//   }>;
//   // Add these new props for server-side pagination
//   pagination?: {
//     currentPage: number;
//     totalPages: number;
//     totalItems: number;
//     itemsPerPage: number;
//     onPageChange: (page: number) => void;
//     onItemsPerPageChange?: (itemsPerPage: number) => void;
//   };
//   loading?: boolean;
// }

// export default function DataTable({ 
//   columns, 
//   data, 
//   selected, 
//   setSelected, 
//   onEdit, 
//   onView,
//   onQuickSale,
//   onQuickPurchase,
//   showEdit = true,
//   customActions,
//   showRowMenu = false,
//   rowMenuItems = [],
//   pagination, // New prop
//   loading = false // New prop
// }: DataTableProps) {
//   const [expandedRow, setExpandedRow] = useState<string | null>(null);
//   const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);
  
//   // Keep local state only if no server-side pagination provided
//   const [rowsPerPage, setRowsPerPage] = useState(pagination?.itemsPerPage || 10);
//   const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);

//   // Use server-side pagination data if provided, otherwise use local slicing
//   const displayData = data; // Don't slice - backend already gives us the right page

//   const toggleRow = (id: string) =>
//     setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

//   const toggleAll = () => {
//     const currentIds = displayData.map((row) => row._id);
//     const allSelected = currentIds.every((id) => selected.includes(id));
//     if (allSelected) {
//       setSelected(selected.filter((id) => !currentIds.includes(id)));
//     } else {
//       setSelected([...new Set([...selected, ...currentIds])]);
//     }
//   };

//   const getNestedValue = (obj: any, path: string) => {
//     return path.split('.').reduce((acc, key) => acc?.[key], obj);
//   };

//   const formatValue = (value: any, type?: string) => {
//     if (value === null || value === undefined) return '-';
    
//     switch (type) {
//       case 'date':
//         return new Date(value).toLocaleDateString();
//       case 'currency':
//         return `$${parseFloat(value).toFixed(2)}`;
//       case 'number':
//         return Number(value).toLocaleString();
//       case 'status':
//         const statusColors: Record<string, string> = {
//           'active': 'bg-green-100 text-green-800',
//           'inactive': 'bg-red-100 text-red-800',
//           'pending': 'bg-yellow-100 text-yellow-800',
//           'completed': 'bg-blue-100 text-blue-800',
//           'received': 'bg-green-100 text-green-800',
//           'cancelled': 'bg-red-100 text-red-800',
//           'partial': 'bg-yellow-100 text-yellow-800',
//           'paid': 'bg-green-100 text-green-800',
//         };
//         return (
//           <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[value.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
//             {value}
//           </span>
//         );
//       default:
//         return value;
//     }
//   };

//   // Handle page change
//   const handlePageChange = (page: number) => {
//     if (pagination) {
//       pagination.onPageChange(page);
//     } else {
//       setCurrentPage(page);
//     }
//   };

//   // Handle rows per page change
//   const handleRowsPerPageChange = (newRowsPerPage: number) => {
//     setRowsPerPage(newRowsPerPage);
//     setCurrentPage(1);
//     if (pagination?.onItemsPerPageChange) {
//       pagination.onItemsPerPageChange(newRowsPerPage);
//     }
//   };

//   // Calculate display values
//   const currentPageToShow = pagination?.currentPage || currentPage;
//   const rowsPerPageToShow = pagination?.itemsPerPage || rowsPerPage;
//   const totalItemsToShow = pagination?.totalItems || data.length;
//   const totalPagesToShow = pagination?.totalPages || Math.ceil(data.length / rowsPerPage);
  
//   const startIndex = (currentPageToShow - 1) * rowsPerPageToShow + 1;
//   const endIndex = Math.min(currentPageToShow * rowsPerPageToShow, totalItemsToShow);

//   if (loading) {
//     return (
//       <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
//         <div className="p-12 text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!displayData.length) {
//     return (
//       <div className="bg-white rounded-xl border p-12 text-center">
//         <Package size={64} className="mx-auto text-gray-300 mb-4" />
//         <h3 className="text-xl font-bold text-gray-800 mb-2">No Data Found</h3>
//         <p className="text-gray-500">Try adjusting your search or filters</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
//             <tr>
//               <th className="p-4 w-12">
//                 <input
//                   type="checkbox"
//                   checked={displayData.length > 0 && displayData.every((row) => selected.includes(row._id))}
//                   onChange={toggleAll}
//                   className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//               </th>
//               {columns.map((col) => (
//                 <th 
//                   key={col.key} 
//                   className="p-4 text-left font-semibold text-gray-700 whitespace-nowrap"
//                 >
//                   {col.label}
//                 </th>
//               ))}
//               <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {displayData.map((row) => {
//               const isLowStock = row.stock !== undefined && row.stock < 50;
//               const isExpiringSoon = row.expiry && new Date(row.expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
//               const isSelected = selected.includes(row._id);

//               return (
//                 <React.Fragment key={row._id}>
//                   <tr className={`border-t hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
//                     <td className="p-4">
//                       <input
//                         type="checkbox"
//                         checked={isSelected}
//                         onChange={() => toggleRow(row._id)}
//                         className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                       />
//                     </td>
                    
//                     {columns.map((col) => {
//                       const value = col.key.includes('.') 
//                         ? getNestedValue(row, col.key)
//                         : row[col.key];
                      
//                       if (col.key === 'stock') {
//                         return (
//                           <td key={col.key} className="p-4">
//                             <div className="flex items-center gap-2">
//                               <span className={`${isLowStock ? "text-red-600 font-bold" : "text-gray-900"}`}>
//                                 {value}
//                               </span>
//                               {isLowStock && <AlertCircle size={16} className="text-red-500" />}
//                             </div>
//                           </td>
//                         );
//                       }

//                       if (col.key === 'expiry' || col.key.includes('expiry')) {
//                         return (
//                           <td key={col.key} className="p-4">
//                             <div className="flex items-center gap-2">
//                               <span className={`${isExpiringSoon ? "text-orange-600 font-semibold" : "text-gray-900"}`}>
//                                 {value ? new Date(value).toLocaleDateString() : 'N/A'}
//                               </span>
//                               {isExpiringSoon && <Clock size={16} className="text-orange-500" />}
//                             </div>
//                           </td>
//                         );
//                       }

//                       if (col.key === 'salePrice' || col.key === 'costPrice' || col.key === 'unitPrice' || col.key === 'unitCost') {
//                         return (
//                           <td key={col.key} className="p-4 font-bold text-green-600">
//                             ${typeof value === 'number' ? value.toFixed(2) : value}
//                           </td>
//                         );
//                       }

//                       if (col.key === 'total' || col.key === 'grandTotal' || col.key === 'totalAmount') {
//                         return (
//                           <td key={col.key} className="p-4 font-bold text-blue-600">
//                             ${typeof value === 'number' ? value.toFixed(2) : value}
//                           </td>
//                         );
//                       }

//                       if (col.key === 'profitMargin') {
//                         const margin = parseFloat(value) || 0;
//                         return (
//                           <td key={col.key} className="p-4">
//                             <div className="flex items-center gap-1">
//                               <TrendingUp size={14} className={margin >= 0 ? "text-green-500" : "text-red-500"} />
//                               <span className={margin >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
//                                 {margin.toFixed(1)}%
//                               </span>
//                             </div>
//                           </td>
//                         );
//                       }

//                       return (
//                         <td key={col.key} className="p-4">
//                           {formatValue(value, col.type)}
//                         </td>
//                       );
//                     })}
                    
//                     <td className="p-4">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => onView(row)}
//                           className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
//                           title="View Details"
//                         >
//                           <Eye size={16} />
//                         </button>
                        
//                         {showEdit && onEdit && (
//                           <button
//                             onClick={() => onEdit(row)}
//                             className="p-2 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
//                             title="Edit"
//                           >
//                             <Edit size={16} />
//                           </button>
//                         )}
                        
//                         {onQuickSale && (
//                           <button
//                             onClick={() => onQuickSale(row)}
//                             className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
//                             title="Quick Sale"
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                           </button>
//                         )}
                        
//                         {onQuickPurchase && (
//                           <button
//                             onClick={() => onQuickPurchase(row)}
//                             className="p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
//                             title="Quick Purchase"
//                           >
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//                             </svg>
//                           </button>
//                         )}
                        
//                         {customActions && customActions(row)}
                        
//                         {showRowMenu && rowMenuItems.length > 0 && (
//                           <div className="relative">
//                             <button
//                               onClick={() => setRowMenuOpen(rowMenuOpen === row._id ? null : row._id)}
//                               className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
//                               title="More Actions"
//                             >
//                               <MoreVertical size={16} />
//                             </button>
                            
//                             {rowMenuOpen === row._id && (
//                               <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-xl z-10 min-w-[160px]">
//                                 {rowMenuItems.map((item, index) => (
//                                   <button
//                                     key={index}
//                                     onClick={() => {
//                                       item.onClick(row);
//                                       setRowMenuOpen(null);
//                                     }}
//                                     className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 ${
//                                       item.variant === 'danger' ? 'text-red-600' : 'text-gray-700'
//                                     } ${index > 0 ? 'border-t' : ''}`}
//                                   >
//                                     {item.icon}
//                                     {item.label}
//                                   </button>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
                  
//                   {expandedRow === row._id && row.items && (
//                     <tr className="bg-gray-50">
//                       <td colSpan={columns.length + 2}>
//                         <div className="p-4">
//                           <h4 className="font-semibold text-gray-700 mb-2">Items</h4>
//                           <div className="overflow-x-auto">
//                             <table className="w-full text-sm">
//                               <thead>
//                                 <tr className="bg-gray-100">
//                                   <th className="p-2 text-left">Product</th>
//                                   <th className="p-2 text-left">Quantity</th>
//                                   <th className="p-2 text-left">Unit Price</th>
//                                   <th className="p-2 text-left">Total</th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {row.items.map((item: any, index: number) => (
//                                   <tr key={index} className="border-b">
//                                     <td className="p-2">{item.productName}</td>
//                                     <td className="p-2">{item.quantity}</td>
//                                     <td className="p-2">${item.unitPrice?.toFixed(2)}</td>
//                                     <td className="p-2 font-semibold">${item.totalCost?.toFixed(2)}</td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
      
//       {/* Table Footer - Modified for server-side pagination */}
//       <div className="px-6 py-4 border-t bg-gray-50 flex justify-between items-center">
//         <div className="text-sm text-gray-600">
//           Showing <span className="font-semibold">{startIndex}</span> to <span className="font-semibold">{endIndex}</span> of <span className="font-semibold">{totalItemsToShow}</span> entries
//         </div>
//         <div className="flex items-center gap-6">
//           <div className="flex items-center gap-2">
//             <span className="text-sm text-gray-600">Rows per page:</span>
//             <select 
//               value={rowsPerPageToShow}
//               onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
//               className="text-sm border rounded px-2 py-1 bg-white"
//             >
//               <option value={10}>10</option>
//               <option value={25}>25</option>
//               <option value={50}>50</option>
//               <option value={100}>100</option>
//             </select>
//           </div>
//           <div className="flex items-center gap-2">
//             <button 
//               onClick={() => handlePageChange(currentPageToShow - 1)}
//               disabled={currentPageToShow === 1}
//               className="px-3 py-1 rounded bg-white border text-gray-600 disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span className="text-sm text-gray-600">
//               Page {currentPageToShow} of {totalPagesToShow}
//             </span>
//             <button 
//               onClick={() => handlePageChange(currentPageToShow + 1)}
//               disabled={currentPageToShow === totalPagesToShow}
//               className="px-3 py-1 rounded bg-white border text-gray-600 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import React from "react";
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
  // Add these new props for server-side pagination
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange?: (itemsPerPage: number) => void;
  };
  loading?: boolean;
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
  rowMenuItems = [],
  pagination, // New prop
  loading = false // New prop
}: DataTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);
  
  // Keep local state only if no server-side pagination provided
  const [rowsPerPage, setRowsPerPage] = useState(pagination?.itemsPerPage || 10);
  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);

  // Use server-side pagination data if provided, otherwise use local slicing
  const displayData = data; // Don't slice - backend already gives us the right page

  const toggleRow = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const toggleAll = () => {
    const currentIds = displayData.map((row) => row._id);
    const allSelected = currentIds.every((id) => selected.includes(id));
    if (allSelected) {
      setSelected(selected.filter((id) => !currentIds.includes(id)));
    } else {
      setSelected([...new Set([...selected, ...currentIds])]);
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
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[value.toLowerCase()] || 'bg-gray-100 text-gray-800'} whitespace-nowrap`}>
            {value}
          </span>
        );
      default:
        return value;
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (pagination) {
      pagination.onPageChange(page);
    } else {
      setCurrentPage(page);
    }
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
    if (pagination?.onItemsPerPageChange) {
      pagination.onItemsPerPageChange(newRowsPerPage);
    }
  };

  // Calculate display values
  const currentPageToShow = pagination?.currentPage || currentPage;
  const rowsPerPageToShow = pagination?.itemsPerPage || rowsPerPage;
  const totalItemsToShow = pagination?.totalItems || data.length;
  const totalPagesToShow = pagination?.totalPages || Math.ceil(data.length / rowsPerPage);
  
  const startIndex = (currentPageToShow - 1) * rowsPerPageToShow + 1;
  const endIndex = Math.min(currentPageToShow * rowsPerPageToShow, totalItemsToShow);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (!displayData.length) {
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
        <table className="min-w-full text-sm table-fixed">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="p-2 w-12">
                <input
                  type="checkbox"
                  checked={displayData.length > 0 && displayData.every((row) => selected.includes(row._id))}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className="p-2 text-left font-semibold text-gray-700 text-xs truncate"
                  title={col.label}
                  style={{ 
                    width: col.type === 'action' ? '80px' : 
                           col.type === 'status' ? '100px' : 
                           col.type === 'date' ? '120px' :
                           col.type === 'currency' ? '120px' :
                           col.type === 'number' ? '100px' : '150px'
                  }}
                >
                  <div className="truncate">{col.label}</div>
                </th>
              ))}
              <th className="p-2 text-left font-semibold text-gray-700 text-xs w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((row) => {
              const isLowStock = row.stock !== undefined && row.stock < 50;
              const isExpiringSoon = row.expiry && new Date(row.expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
              const isSelected = selected.includes(row._id);

              return (
                <React.Fragment key={row._id}>
                  <tr className={`border-t hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
                    <td className="p-2 w-12">
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
                          <td key={col.key} className="p-2">
                            <div className="flex items-center gap-1 truncate">
                              <span className={`text-xs ${isLowStock ? "text-red-600 font-bold" : "text-gray-900"} truncate`} title={value}>
                                {value}
                              </span>
                              {isLowStock && <AlertCircle size={14} className="text-red-500 flex-shrink-0" />}
                            </div>
                          </td>
                        );
                      }

                      if (col.key === 'expiry' || col.key.includes('expiry')) {
                        return (
                          <td key={col.key} className="p-2">
                            <div className="flex items-center gap-1 truncate">
                              <span className={`text-xs ${isExpiringSoon ? "text-orange-600 font-semibold" : "text-gray-900"} truncate`} 
                                title={value ? new Date(value).toLocaleDateString() : 'N/A'}>
                                {value ? new Date(value).toLocaleDateString() : 'N/A'}
                              </span>
                              {isExpiringSoon && <Clock size={14} className="text-orange-500 flex-shrink-0" />}
                            </div>
                          </td>
                        );
                      }

                      if (col.key === 'salePrice' || col.key === 'costPrice' || col.key === 'unitPrice' || col.key === 'unitCost') {
                        return (
                          <td key={col.key} className="p-2 font-bold text-green-600 text-xs truncate" 
                            title={`$${typeof value === 'number' ? value.toFixed(2) : value}`}>
                            ${typeof value === 'number' ? value.toFixed(2) : value}
                          </td>
                        );
                      }

                      if (col.key === 'total' || col.key === 'grandTotal' || col.key === 'totalAmount') {
                        return (
                          <td key={col.key} className="p-2 font-bold text-blue-600 text-xs truncate"
                            title={`$${typeof value === 'number' ? value.toFixed(2) : value}`}>
                            ${typeof value === 'number' ? value.toFixed(2) : value}
                          </td>
                        );
                      }

                      if (col.key === 'profitMargin') {
                        const margin = parseFloat(value) || 0;
                        return (
                          <td key={col.key} className="p-2">
                            <div className="flex items-center gap-1 truncate">
                              <TrendingUp size={12} className={`flex-shrink-0 ${margin >= 0 ? "text-green-500" : "text-red-500"}`} />
                              <span className={`text-xs truncate ${margin >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}`}
                                title={`${margin.toFixed(1)}%`}>
                                {margin.toFixed(1)}%
                              </span>
                            </div>
                          </td>
                        );
                      }

                      return (
                        <td key={col.key} className="p-2 text-xs truncate" title={formatValue(value, col.type)?.toString()}>
                          {formatValue(value, col.type)}
                        </td>
                      );
                    })}
                    
                    <td className="p-2 w-28">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onView(row)}
                          className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex-shrink-0"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        
                        {showEdit && onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-1.5 rounded bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors flex-shrink-0"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                        )}
                        
                        {onQuickSale && (
                          <button
                            onClick={() => onQuickSale(row)}
                            className="p-1.5 rounded bg-green-50 text-green-600 hover:bg-green-100 transition-colors flex-shrink-0"
                            title="Quick Sale"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        )}
                        
                        {onQuickPurchase && (
                          <button
                            onClick={() => onQuickPurchase(row)}
                            className="p-1.5 rounded bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors flex-shrink-0"
                            title="Quick Purchase"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </button>
                        )}
                        
                        {customActions && customActions(row)}
                        
                        {showRowMenu && rowMenuItems.length > 0 && (
                          <div className="relative flex-shrink-0">
                            <button
                              onClick={() => setRowMenuOpen(rowMenuOpen === row._id ? null : row._id)}
                              className="p-1.5 rounded bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                              title="More Actions"
                            >
                              <MoreVertical size={14} />
                            </button>
                            
                            {rowMenuOpen === row._id && (
                              <div className="absolute right-0 mt-1 bg-white border rounded-lg shadow-xl z-10 min-w-[160px] max-w-[200px]">
                                {rowMenuItems.map((item, index) => (
                                  <button
                                    key={index}
                                    onClick={() => {
                                      item.onClick(row);
                                      setRowMenuOpen(null);
                                    }}
                                    className={`w-full px-3 py-1.5 text-left hover:bg-gray-50 flex items-center gap-2 text-xs truncate ${
                                      item.variant === 'danger' ? 'text-red-600' : 'text-gray-700'
                                    } ${index > 0 ? 'border-t' : ''}`}
                                    title={item.label}
                                  >
                                    {item.icon}
                                    <span className="truncate">{item.label}</span>
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
                        <div className="p-2">
                          <h4 className="font-semibold text-gray-700 mb-1 text-xs">Items</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs table-fixed">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="p-1.5 text-left w-2/5 truncate">Product</th>
                                  <th className="p-1.5 text-left w-1/5 truncate">Quantity</th>
                                  <th className="p-1.5 text-left w-1/5 truncate">Unit Price</th>
                                  <th className="p-1.5 text-left w-1/5 truncate">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {row.items.map((item: any, index: number) => (
                                  <tr key={index} className="border-b">
                                    <td className="p-1.5 truncate" title={item.productName}>{item.productName}</td>
                                    <td className="p-1.5 truncate">{item.quantity}</td>
                                    <td className="p-1.5 truncate">${item.unitPrice?.toFixed(2)}</td>
                                    <td className="p-1.5 truncate font-semibold">${item.totalCost?.toFixed(2)}</td>
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
      
      {/* Table Footer - Modified for server-side pagination */}
      <div className="px-4 py-3 border-t bg-gray-50 flex justify-between items-center">
        <div className="text-xs text-gray-600">
          Showing <span className="font-semibold">{startIndex}</span> to <span className="font-semibold">{endIndex}</span> of <span className="font-semibold">{totalItemsToShow}</span> entries
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Rows per page:</span>
            <select 
              value={rowsPerPageToShow}
              onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
              className="text-xs border rounded px-2 py-1 bg-white"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => handlePageChange(currentPageToShow - 1)}
              disabled={currentPageToShow === 1}
              className="px-2 py-1 rounded bg-white border text-gray-600 disabled:opacity-50 text-xs"
            >
              Previous
            </button>
            <span className="text-xs text-gray-600 px-2">
              Page {currentPageToShow} of {totalPagesToShow}
            </span>
            <button 
              onClick={() => handlePageChange(currentPageToShow + 1)}
              disabled={currentPageToShow === totalPagesToShow}
              className="px-2 py-1 rounded bg-white border text-gray-600 disabled:opacity-50 text-xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
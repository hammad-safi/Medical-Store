// "use client";
// import { useState, useEffect, useMemo } from "react";
// import api from "@/app/lib/axios";
// import Toast from "@/components/ui/toast";
// import { DataTableHeader } from "@/components/data-table";
// import DataTableActions from "@/components/data-table/tableAction";
// import DataTable from "@/components/data-table/dataTable";
// import { AddPurchaseModal } from "./AddEditModal";
// // import { ViewPurchaseModal } from "./viewPurchaseModal";
// import { Purchase, ToastType } from "@/components/types";
// import { Eye, Trash2, Download, RefreshCw } from "lucide-react";
// import ViewPurchaseModal from "./viewPurchaseModal";

// export default function PurchasesPage() {
//   const [purchases, setPurchases] = useState<Purchase[]>([]);
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState<string[]>([]);
//   const [sortBy, setSortBy] = useState("date");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [toast, setToast] = useState<ToastType | null>(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editPurchase, setEditPurchase] = useState<Purchase | null>(null);
//   const [viewOpen, setViewOpen] = useState(false);
//   const [viewPurchase, setViewPurchase] = useState<Purchase | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const fetchPurchases = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("/purchases");
//       console.log("Purchases data:", response.data);
//       setPurchases(response.data.data?.purchases || response.data.data || []);
//     } catch (err: any) {
//       console.error("Error fetching purchases:", err);
//       showToast(err.response?.data?.message || "Failed to fetch purchases", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPurchases();
//   }, []);

//   const handleDelete = async () => {
//     if (!selected.length) {
//       showToast("Please select purchases to delete", "info");
//       return;
//     }

//     setDeleteLoading(true);
//     try {
//       await api.delete("/purchases", { 
//         data: { ids: selected } 
//       });
//       showToast(`${selected.length} purchase${selected.length > 1 ? 's' : ''} deleted successfully`);
//       setSelected([]);
//       fetchPurchases();
//     } catch (err: any) {
//       showToast(err.response?.data?.message || "Delete failed", "error");
//     } finally {
//       setDeleteLoading(false);
//     }
//   };
// const handleView = (purchase: Purchase) => {
//   console.log("Viewing purchase:", purchase); // Debug log
//   setViewPurchase(purchase);
//   setViewOpen(true);
// };

// // Also add this useEffect to debug the view modal
// useEffect(() => {
//   if (viewOpen) {
//     console.log("View modal opened with data:", viewPurchase);
//   }
// }, [viewOpen, viewPurchase]);
//   const handleModalSubmit = async (form: any) => {
//     try {
//       if (editPurchase) {
//         showToast("Update feature coming soon", "info");
//         return;
//       }

//       console.log("Submitting purchase data:", form);
//       const response = await api.post("/purchases", form);
//       console.log("Purchase created:", response.data);
      
//       showToast("Purchase added successfully", "success");
//       setModalOpen(false);
//       setEditPurchase(null);
//       fetchPurchases();
//     } catch (err: any) {
//       console.error("Error creating purchase:", err.response?.data || err);
//       showToast(err.response?.data?.message || "Failed to create purchase", "error");
//     }
//   };

//   const handleAdd = () => {
//     setEditPurchase(null);
//     setModalOpen(true);
//   };

//   // const handleView = (purchase: Purchase) => {
//   //   setViewPurchase(purchase);
//   //   setViewOpen(true);
//   // };

//   const handleExport = () => {
//     try {
//       const headers = ["Invoice #", "Supplier", "Total Items", "Subtotal", "Tax", "Shipping", "Grand Total", "Status", "Payment Status", "Date"];
//       const csvData = filtered.map(purchase => {
//         const totalQuantity = purchase.items?.reduce((sum, item) => sum + item.quantity, 0) || purchase.totalQuantity || 0;
//         const subtotal = purchase.subtotal || 0;
//         const taxAmount = purchase.taxAmount || 0;
//         const shippingCost = purchase.shippingCost || 0;
//         const grandTotal = purchase.grandTotal || 0;
        
//         return [
//           purchase.invoiceNumber || "N/A",
//           purchase.supplierName || purchase.supplierId?.name || "N/A",
//           totalQuantity,
//           subtotal.toFixed(2),
//           taxAmount.toFixed(2),
//           shippingCost.toFixed(2),
//           grandTotal.toFixed(2),
//           purchase.status || "N/A",
//           purchase.paymentStatus || "N/A",
//           new Date(purchase.purchaseDate || purchase.createdAt).toLocaleDateString()
//         ];
//       });
      
//       const csvContent = [
//         headers.join(","),
//         ...csvData.map(row => row.join(","))
//       ].join("\n");
      
//       const blob = new Blob([csvContent], { type: "text/csv" });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `purchases_${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
      
//       showToast("Export completed successfully", "success");
//     } catch (error) {
//       showToast("Export failed", "error");
//     }
//   };

//   const handleBulkStatusUpdate = async (newStatus: string) => {
//     if (!selected.length) {
//       showToast("Please select purchases to update", "info");
//       return;
//     }

//     try {
//       // Update each selected purchase status
//       const promises = selected.map(id => 
//         api.patch(`/purchases/${id}`, { status: newStatus })
//       );
//       await Promise.all(promises);
      
//       showToast(`Status updated to ${newStatus} for ${selected.length} purchase${selected.length > 1 ? 's' : ''}`, "success");
//       setSelected([]);
//       fetchPurchases();
//     } catch (err: any) {
//       showToast(err.response?.data?.message || "Failed to update status", "error");
//     }
//   };

//   const filtered = useMemo(() => {
//     let result = purchases.filter(p => {
//       const searchLower = search.toLowerCase();
//       return (
//         (p.invoiceNumber?.toLowerCase().includes(searchLower)) ||
//         (p.supplierName?.toLowerCase().includes(searchLower)) ||
//         (p.supplierId?.name?.toLowerCase().includes(searchLower)) ||
//         (p.items?.some(item => item.productName?.toLowerCase().includes(searchLower)))
//       );
//     });

//     // Apply status filter
//     if (filterStatus) {
//       result = result.filter(p => p.status === filterStatus);
//     }

//     // Apply sorting
//     result.sort((a, b) => {
//       const dateA = new Date(a.purchaseDate || a.createdAt).getTime();
//       const dateB = new Date(b.purchaseDate || b.createdAt).getTime();
      
//       if (sortBy === "date") return dateB - dateA;
//       if (sortBy === "amount") return (b.grandTotal || 0) - (a.grandTotal || 0);
//       if (sortBy === "quantity") {
//         const totalQtyA = a.items?.reduce((sum, item) => sum + item.quantity, 0) || a.totalQuantity || 0;
//         const totalQtyB = b.items?.reduce((sum, item) => sum + item.quantity, 0) || b.totalQuantity || 0;
//         return totalQtyB - totalQtyA;
//       }
//       if (sortBy === "invoice") return (a.invoiceNumber || "").localeCompare(b.invoiceNumber || "");
//       return 0;
//     });

//     return result;
//   }, [purchases, search, sortBy, filterStatus]);

//   const suggestions = useMemo(() => {
//     return filtered.slice(0, 5).map(purchase => ({
//       _id: purchase._id,
//       name: purchase.invoiceNumber || "N/A",
//       category: purchase.status || "N/A"
//     }));
//   }, [filtered]);

//   const statuses = useMemo(() => {
//     const uniqueStatuses = new Set<string>();
//     purchases.forEach(purchase => {
//       if (purchase.status) {
//         uniqueStatuses.add(purchase.status);
//       }
//     });
//     return Array.from(uniqueStatuses);
//   }, [purchases]);

//   // Calculate stats
//   const stats = useMemo(() => {
//     const totalSpent = purchases.reduce((sum, p) => sum + (p.grandTotal || 0), 0);
//     const totalItems = purchases.reduce((sum, p) => {
//       if (p.items) {
//         return sum + p.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
//       }
//       return sum + (p.totalQuantity || 0);
//     }, 0);
//     const pendingCount = purchases.filter(p => p.status === 'Pending').length;
//     const receivedCount = purchases.filter(p => p.status === 'Received').length;

//     return { totalSpent, totalItems, pendingCount, receivedCount };
//   }, [purchases]);

//   // Prepare table data
//   const tableData = useMemo(() => {
//     return filtered.map(p => {
//       const totalQuantity = p.items?.reduce((sum, item) => sum + item.quantity, 0) || p.totalQuantity || 0;
//       const totalItemsCount = p.items?.length || 0;
      
//       return {
//         ...p,
//         _id: p._id,
//         invoiceNumber: p.invoiceNumber || "N/A",
//         supplier: p.supplierName || p.supplierId?.name || "N/A",
//         totalQuantity,
//         totalItems: totalItemsCount,
//         subtotal: `$${(p.subtotal || 0).toFixed(2)}`,
//         tax: `$${(p.taxAmount || 0).toFixed(2)}`,
//         shipping: `$${(p.shippingCost || 0).toFixed(2)}`,
//         grandTotal: `$${(p.grandTotal || 0).toFixed(2)}`,
//         status: p.status || "N/A",
//         paymentStatus: p.paymentStatus || "N/A",
//         date: new Date(p.purchaseDate || p.createdAt).toLocaleDateString(),
//       };
//     });
//   }, [filtered]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 space-y-6">
//       {/* Stats Cards */}
//       {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Purchases</p>
//               <p className="text-2xl font-bold text-gray-900">{purchases.length}</p>
//             </div>
//             <div className="p-3 bg-blue-100 rounded-lg">
//               <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//               </svg>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Spent</p>
//               <p className="text-2xl font-bold text-gray-900">${stats.totalSpent.toFixed(2)}</p>
//             </div>
//             <div className="p-3 bg-green-100 rounded-lg">
//               <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Items</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
//             </div>
//             <div className="p-3 bg-purple-100 rounded-lg">
//               <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//               </svg>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Pending</p>
//               <p className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</p>
//             </div>
//             <div className="p-3 bg-yellow-100 rounded-lg">
//               <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div> */}

//       {/* Header */}
//       <DataTableHeader
//         title="Purchase Management"
//         subtitle={`Total Spent: $${stats.totalSpent.toFixed(2)} | Purchases: ${purchases.length}`}
//         search={search}
//         setSearch={setSearch}
//         suggestions={suggestions}
//         onAdd={handleAdd}
//         sortBy={sortBy}
//         setSortBy={setSortBy}
//         filterCategory={filterStatus}
//         setFilterCategory={setFilterStatus}
//         categories={statuses}
//         showAddButton={true}
//         onExport={handleExport}
//         selectedCount={selected.length}
//       />

//       {/* Table Actions */}
//       {selected.length > 0 && (
//         <div className="bg-white p-4 rounded-lg border shadow-sm">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <span className="font-medium">{selected.length} selected</span>
//               <div className="flex gap-2">
//                 <button
//                   onClick={handleDelete}
//                   disabled={deleteLoading}
//                   className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
//                 >
//                   <Trash2 size={14} />
//                   Delete
//                 </button>
//                 <button
//                   onClick={() => handleBulkStatusUpdate('Received')}
//                   className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-1"
//                 >
//                   <CheckCircle size={14} />
//                   Mark Received
//                 </button>
//                 <button
//                   onClick={() => handleBulkStatusUpdate('Pending')}
//                   className="px-3 py-1.5 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 flex items-center gap-1"
//                 >
//                   <Clock size={14} />
//                   Mark Pending
//                 </button>
//               </div>
//             </div>
//             <button
//               onClick={() => setSelected([])}
//               className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
//             >
//               Clear Selection
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Loading State */}
//       {loading ? (
//         <div className="fixed inset-0 bg-black/10 z-40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
//             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//             <span className="text-gray-700">Loading Purchases...</span>
//           </div>
//         </div>
//       ) : purchases.length === 0 ? (
//         <div className="bg-white rounded-xl border p-12 text-center">
//           <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
//             <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//             </svg>
//           </div>
//           <h3 className="text-xl font-bold text-gray-800 mb-2">No Purchases Found</h3>
//           <p className="text-gray-500 mb-6">Get started by recording your first purchase</p>
//           <button
//             onClick={handleAdd}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//           >
//             <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//             </svg>
//             Add Purchase
//           </button>
//         </div>
//       ) : (
//         <DataTable
//           columns={[
//             { key: "invoiceNumber", label: "Invoice #", type: "text" },
//             { key: "supplier", label: "Supplier", type: "text" },
//             { key: "totalItems", label: "Items", type: "number" },
//             { key: "totalQuantity", label: "Qty", type: "number" },
//             { key: "grandTotal", label: "Total", type: "currency" },
//             { key: "status", label: "Status", type: "badge" },
//             { key: "paymentStatus", label: "Payment", type: "badge" },
//             { key: "date", label: "Date", type: "date" },
//           ]}
//           data={tableData}
//           selected={selected}
//           setSelected={setSelected}
//           onView={handleView}
//           showEdit={false}
//           showRowMenu={true}
//           rowMenuItems={[
//             {
//               label: "View Details",
//               icon: <Eye size={14} />,
//               onClick: handleView
//             },
//             {
//               label: "Download Invoice",
//               icon: <Download size={14} />,
//               onClick: (purchase) => {
//                 // This would be implemented later
//                 showToast("Invoice download feature coming soon", "info");
//               }
//             },
//             {
//               label: "Refresh",
//               icon: <RefreshCw size={14} />,
//               onClick: fetchPurchases
//             },
//             {
//               label: "Delete",
//               icon: <Trash2 size={14} />,
//               onClick: (purchase) => {
//                 setSelected([purchase._id]);
//                 setTimeout(() => handleDelete(), 100);
//               },
//               variant: 'danger'
//             }
//           ]}
//         />
//       )}

//       {/* Modals */}
//       <AddPurchaseModal
//         open={modalOpen}
//         onClose={() => {
//           setModalOpen(false);
//           setEditPurchase(null);
//         }}
//         onSubmit={handleModalSubmit}
//         preSelectedProduct={null}
//       />
      
//       <ViewPurchaseModal
//         open={viewOpen}
//         onClose={() => setViewOpen(false)}
//         data={viewPurchase}
//       />

//       {toast && (
//         <Toast
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast(null)}
//         />
//       )}
//     </div>
//   );
// }

// // Helper components
// const CheckCircle = ({ size = 14 }: { size?: number }) => (
//   <svg className={`w-${size} h-${size}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const Clock = ({ size = 14 }: { size?: number }) => (
//   <svg className={`w-${size} h-${size}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// "use client";
// import { useState, useEffect, useMemo } from "react";
// import api from "@/app/lib/axios";
// import Toast from "@/components/ui/toast";
// import { DataTableHeader } from "@/components/data-table";
// import DataTable from "@/components/data-table/dataTable";
// import { AddPurchaseModal } from "./AddEditModal";
// import { Purchase, ToastType } from "@/components/types";
// import { Eye, Trash2, Download, RefreshCw } from "lucide-react";
// import ViewPurchaseModal from "./viewPurchaseModal";

// export default function PurchasesPage() {
//   const [purchases, setPurchases] = useState<Purchase[]>([]);
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState<string[]>([]);
//   const [sortBy, setSortBy] = useState("date");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [toast, setToast] = useState<ToastType | null>(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editPurchase, setEditPurchase] = useState<Purchase | null>(null);
//   const [viewOpen, setViewOpen] = useState(false);
//   const [viewPurchase, setViewPurchase] = useState<Purchase | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
  
//   // Add these new states for server-side pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [totalItems, setTotalItems] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);

//   const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   // Modified fetchPurchases to include pagination params
//   const fetchPurchases = async (page = currentPage, limit = itemsPerPage) => {
//     setLoading(true);
//     try {
//       const response = await api.get("/purchases", {
//         params: {
//           page,
//           limit,
//           search: search || undefined,
//           status: filterStatus || undefined,
//           sortBy: sortBy === "date" ? "purchaseDate" : sortBy,
//           sortOrder: "desc"
//         }
//       });
      
//       console.log("Purchases response:", response.data);
      
//       // Handle different response structures
//       let purchasesData = [];
//       let paginationData = { total: 0, page: 1, limit: 10, totalPages: 1 };
      
//       if (response.data?.data?.purchases) {
//         purchasesData = response.data.data.purchases;
//         paginationData = response.data.data.pagination;
//       } else if (response.data?.purchases) {
//         purchasesData = response.data.purchases;
//         paginationData = response.data.pagination;
//       } else if (Array.isArray(response.data)) {
//         purchasesData = response.data;
//         paginationData.total = purchasesData.length;
//         paginationData.totalPages = Math.ceil(purchasesData.length / limit);
//       }
      
//       setPurchases(purchasesData);
//       setTotalItems(paginationData.total);
//       setTotalPages(paginationData.totalPages);
//       setCurrentPage(paginationData.page);
      
//     } catch (err: any) {
//       console.error("Error fetching purchases:", err);
//       showToast(err.response?.data?.message || "Failed to fetch purchases", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch purchases when pagination or filters change
//   useEffect(() => {
//     fetchPurchases(currentPage, itemsPerPage);
//   }, [currentPage, itemsPerPage, search, filterStatus, sortBy]);

//   const handleDelete = async () => {
//     if (!selected.length) {
//       showToast("Please select purchases to delete", "info");
//       return;
//     }

//     setDeleteLoading(true);
//     try {
//       await api.delete("/purchases", { 
//         data: { ids: selected } 
//       });
//       showToast(`${selected.length} purchase${selected.length > 1 ? 's' : ''} deleted successfully`);
//       setSelected([]);
//       fetchPurchases(currentPage, itemsPerPage);
//     } catch (err: any) {
//       showToast(err.response?.data?.message || "Delete failed", "error");
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const handleView = (purchase: Purchase) => {
//     setViewPurchase(purchase);
//     setViewOpen(true);
//   };

//   const handleModalSubmit = async (form: any) => {
//     try {
//       if (editPurchase) {
//         showToast("Update feature coming soon", "info");
//         return;
//       }

//       console.log("Submitting purchase data:", form);
//       const response = await api.post("/purchases", form);
//       console.log("Purchase created:", response.data);
      
//       showToast("Purchase added successfully", "success");
//       setModalOpen(false);
//       setEditPurchase(null);
//       fetchPurchases(currentPage, itemsPerPage);
//     } catch (err: any) {
//       console.error("Error creating purchase:", err.response?.data || err);
//       showToast(err.response?.data?.message || "Failed to create purchase", "error");
//     }
//   };

//   const handleAdd = () => {
//     setEditPurchase(null);
//     setModalOpen(true);
//   };

//   const handleExport = () => {
//     try {
//       const headers = ["Invoice #", "Supplier", "Total Items", "Subtotal", "Tax", "Shipping", "Grand Total", "Status", "Payment Status", "Date"];
//       const csvData = purchases.map(purchase => {
//         const totalQuantity = purchase.items?.reduce((sum, item) => sum + item.quantity, 0) || purchase.totalQuantity || 0;
//         const subtotal = purchase.subtotal || 0;
//         const taxAmount = purchase.taxAmount || 0;
//         const shippingCost = purchase.shippingCost || 0;
//         const grandTotal = purchase.grandTotal || 0;
        
//         return [
//           purchase.invoiceNumber || "N/A",
//           purchase.supplierName || purchase.supplierId?.name || "N/A",
//           totalQuantity,
//           subtotal.toFixed(2),
//           taxAmount.toFixed(2),
//           shippingCost.toFixed(2),
//           grandTotal.toFixed(2),
//           purchase.status || "N/A",
//           purchase.paymentStatus || "N/A",
//           new Date(purchase.purchaseDate || purchase.createdAt).toLocaleDateString()
//         ];
//       });
      
//       const csvContent = [
//         headers.join(","),
//         ...csvData.map(row => row.join(","))
//       ].join("\n");
      
//       const blob = new Blob([csvContent], { type: "text/csv" });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `purchases_${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
      
//       showToast("Export completed successfully", "success");
//     } catch (error) {
//       showToast("Export failed", "error");
//     }
//   };

//   const handleBulkStatusUpdate = async (newStatus: string) => {
//     if (!selected.length) {
//       showToast("Please select purchases to update", "info");
//       return;
//     }

//     try {
//       // Update each selected purchase status
//       const promises = selected.map(id => 
//         api.patch(`/purchases/${id}`, { status: newStatus })
//       );
//       await Promise.all(promises);
      
//       showToast(`Status updated to ${newStatus} for ${selected.length} purchase${selected.length > 1 ? 's' : ''}`, "success");
//       setSelected([]);
//       fetchPurchases(currentPage, itemsPerPage);
//     } catch (err: any) {
//       showToast(err.response?.data?.message || "Failed to update status", "error");
//     }
//   };

//   // Remove the filtered useMemo - all filtering is now server-side
//   const suggestions = useMemo(() => {
//     return purchases.slice(0, 5).map(purchase => ({
//       _id: purchase._id,
//       name: purchase.invoiceNumber || "N/A",
//       category: purchase.status || "N/A"
//     }));
//   }, [purchases]);

//   const statuses = useMemo(() => {
//     const uniqueStatuses = new Set<string>();
//     purchases.forEach(purchase => {
//       if (purchase.status) {
//         uniqueStatuses.add(purchase.status);
//       }
//     });
//     return Array.from(uniqueStatuses);
//   }, [purchases]);

//   // Calculate stats (only for current page data)
//   const stats = useMemo(() => {
//     const totalSpent = purchases.reduce((sum, p) => sum + (p.grandTotal || 0), 0);
//     const totalItems = purchases.reduce((sum, p) => {
//       if (p.items) {
//         return sum + p.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
//       }
//       return sum + (p.totalQuantity || 0);
//     }, 0);
//     const pendingCount = purchases.filter(p => p.status === 'Pending').length;
//     const receivedCount = purchases.filter(p => p.status === 'Received').length;

//     return { totalSpent, totalItems, pendingCount, receivedCount };
//   }, [purchases]);

//   // Prepare table data (no client-side filtering needed)
//   const tableData = useMemo(() => {
//     return purchases.map(p => {
//       const totalQuantity = p.items?.reduce((sum, item) => sum + item.quantity, 0) || p.totalQuantity || 0;
//       const totalItemsCount = p.items?.length || 0;
      
//       return {
//         ...p,
//         _id: p._id,
//         invoiceNumber: p.invoiceNumber || "N/A",
//         supplier: p.supplierName || p.supplierId?.name || "N/A",
//         totalQuantity,
//         totalItems: totalItemsCount,
//         subtotal: `$${(p.subtotal || 0).toFixed(2)}`,
//         tax: `$${(p.taxAmount || 0).toFixed(2)}`,
//         shipping: `$${(p.shippingCost || 0).toFixed(2)}`,
//         grandTotal: `$${(p.grandTotal || 0).toFixed(2)}`,
//         status: p.status || "N/A",
//         paymentStatus: p.paymentStatus || "N/A",
//         date: new Date(p.purchaseDate || p.createdAt).toLocaleDateString(),
//       };
//     });
//   }, [purchases]);

//   // Handle page change
//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   // Handle items per page change
//   const handleItemsPerPageChange = (newItemsPerPage: number) => {
//     setItemsPerPage(newItemsPerPage);
//     setCurrentPage(1);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 space-y-6">
//       {/* Header */}
//       <DataTableHeader
//         title="Purchase Management"
//         subtitle={`Total Spent: $${stats.totalSpent.toFixed(2)} | Purchases: ${totalItems}`}
//         search={search}
//         setSearch={setSearch}
//         suggestions={suggestions}
//         onAdd={handleAdd}
//         sortBy={sortBy}
//         setSortBy={setSortBy}
//         filterCategory={filterStatus}
//         setFilterCategory={setFilterStatus}
//         categories={statuses}
//         showAddButton={true}
//         onExport={handleExport}
//         selectedCount={selected.length}
//       />

//       {/* Table Actions */}
//       {selected.length > 0 && (
//         <div className="bg-white p-4 rounded-lg border shadow-sm">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <span className="font-medium">{selected.length} selected</span>
//               <div className="flex gap-2">
//                 <button
//                   onClick={handleDelete}
//                   disabled={deleteLoading}
//                   className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
//                 >
//                   <Trash2 size={14} />
//                   Delete
//                 </button>
//                 <button
//                   onClick={() => handleBulkStatusUpdate('Received')}
//                   className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-1"
//                 >
//                   <CheckCircle size={14} />
//                   Mark Received
//                 </button>
//                 <button
//                   onClick={() => handleBulkStatusUpdate('Pending')}
//                   className="px-3 py-1.5 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 flex items-center gap-1"
//                 >
//                   <Clock size={14} />
//                   Mark Pending
//                 </button>
//               </div>
//             </div>
//             <button
//               onClick={() => setSelected([])}
//               className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
//             >
//               Clear Selection
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Loading State */}
//       {loading ? (
//         <div className="fixed inset-0 bg-black/10 z-40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
//             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//             <span className="text-gray-700">Loading Purchases...</span>
//           </div>
//         </div>
//       ) : purchases.length === 0 ? (
//         <div className="bg-white rounded-xl border p-12 text-center">
//           <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
//             <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//             </svg>
//           </div>
//           <h3 className="text-xl font-bold text-gray-800 mb-2">No Purchases Found</h3>
//           <p className="text-gray-500 mb-6">Get started by recording your first purchase</p>
//           <button
//             onClick={handleAdd}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//           >
//             <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//             </svg>
//             Add Purchase
//           </button>
//         </div>
//       ) : (
//         <DataTable
//           columns={[
//             { key: "invoiceNumber", label: "Invoice #", type: "text" },
//             { key: "supplier", label: "Supplier", type: "text" },
//             { key: "totalItems", label: "Items", type: "number" },
//             { key: "totalQuantity", label: "Qty", type: "number" },
//             { key: "grandTotal", label: "Total", type: "currency" },
//             { key: "status", label: "Status", type: "badge" },
//             { key: "paymentStatus", label: "Payment", type: "badge" },
//             { key: "date", label: "Date", type: "date" },
//           ]}
//           data={tableData}
//           selected={selected}
//           setSelected={setSelected}
//           onView={handleView}
//           showEdit={false}
//           showRowMenu={true}
//           rowMenuItems={[
//             {
//               label: "View Details",
//               icon: <Eye size={14} />,
//               onClick: handleView
//             },
//             {
//               label: "Download Invoice",
//               icon: <Download size={14} />,
//               onClick: (purchase) => {
//                 showToast("Invoice download feature coming soon", "info");
//               }
//             },
//             {
//               label: "Refresh",
//               icon: <RefreshCw size={14} />,
//               onClick: () => fetchPurchases(currentPage, itemsPerPage)
//             },
//             {
//               label: "Delete",
//               icon: <Trash2 size={14} />,
//               onClick: (purchase) => {
//                 setSelected([purchase._id]);
//                 setTimeout(() => handleDelete(), 100);
//               },
//               variant: 'danger'
//             }
//           ]}
//           // Add pagination props
//           pagination={{
//             currentPage,
//             totalPages,
//             totalItems,
//             itemsPerPage,
//             onPageChange: handlePageChange,
//             onItemsPerPageChange: handleItemsPerPageChange
//           }}
//           loading={loading}
//         />
//       )}

//       {/* Modals */}
//       <AddPurchaseModal
//         open={modalOpen}
//         onClose={() => {
//           setModalOpen(false);
//           setEditPurchase(null);
//         }}
//         onSubmit={handleModalSubmit}
//         preSelectedProduct={null}
//       />
      
//       <ViewPurchaseModal
//         open={viewOpen}
//         onClose={() => setViewOpen(false)}
//         data={viewPurchase}
//       />

//       {toast && (
//         <Toast
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast(null)}
//         />
//       )}
//     </div>
//   );
// }

// // Helper components
// const CheckCircle = ({ size = 14 }: { size?: number }) => (
//   <svg className={`w-${size} h-${size}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

// const Clock = ({ size = 14 }: { size?: number }) => (
//   <svg className={`w-${size} h-${size}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//   </svg>
// );

"use client";
import { useState, useMemo } from "react";
import api from "@/app/lib/axios";
import Toast from "@/components/ui/toast";
import { DataTableHeader } from "@/components/data-table";
import DataTable from "@/components/data-table/dataTable";
import { AddPurchaseModal } from "./AddEditModal";
import { Purchase, ToastType } from "@/components/types";
import { Eye, Trash2, Download, RefreshCw, Loader, CheckCircle, Clock } from "lucide-react";
import ViewPurchaseModal from "./viewPurchaseModal";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from "@/app/hooks/useAuth";
import { usePurchasesData } from "@/app/hooks/useApiData";

// Custom hook for purchases operations
const usePurchases = (page: number = 1, limit: number = 10, search: string = "", filterStatus: string = "", sortBy: string = "date") => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Use app data hook for purchases
  const {
    purchases: allPurchases,
    isLoading,
    isFetching,
    isPreviousData,
    refetch: refetchPurchases
  } = usePurchasesData();

  // Add purchase mutation
  const addPurchaseMutation = useMutation({
    mutationFn: async (form: any) => {
      const response = await api.post("/purchases", form);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-data'] });
    },
  });

  // Delete purchases mutation
  const deletePurchasesMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await api.delete("/purchases", { 
        data: { ids } 
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-data'] });
    },
  });

  // Update purchase status mutation
  const updatePurchaseStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const response = await api.patch(`/purchases/${id}`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-data'] });
    },
  });

  // Bulk update status mutation
  const bulkUpdateStatusMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[], status: string }) => {
      const promises = ids.map(id => 
        api.patch(`/purchases/${id}`, { status })
      );
      await Promise.all(promises);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-data'] });
    },
  });

  // Filter and paginate purchases locally
  const filteredPurchases = useMemo(() => {
    let result = allPurchases.filter(purchase => {
      // Search filter
      const searchMatch = search === "" || 
        (purchase.invoiceNumber && purchase.invoiceNumber.toLowerCase().includes(search.toLowerCase())) ||
        (purchase.supplierName && purchase.supplierName.toLowerCase().includes(search.toLowerCase()));
      
      // Status filter
      const statusMatch = filterStatus === "" || filterStatus === "All" || 
        purchase.status === filterStatus;
      
      return searchMatch && statusMatch;
    });

    // Sort purchases
    result.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.purchaseDate || a.createdAt);
        const dateB = new Date(b.purchaseDate || b.createdAt);
        return dateB.getTime() - dateA.getTime(); // Descending by date
      }
      if (sortBy === "total") {
        return (b.grandTotal || 0) - (a.grandTotal || 0);
      }
      return 0;
    });

    return result;
  }, [allPurchases, search, filterStatus, sortBy]);

  // Apply pagination
  const paginatedPurchases = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredPurchases.slice(startIndex, endIndex);
  }, [filteredPurchases, page, limit]);

  return {
    purchases: paginatedPurchases,
    pagination: {
      page,
      limit,
      total: filteredPurchases.length,
      totalPages: Math.ceil(filteredPurchases.length / limit)
    },
    isLoading,
    isFetching,
    isPreviousData,
    refetch: refetchPurchases,
    addPurchase: addPurchaseMutation,
    deletePurchases: deletePurchasesMutation,
    updatePurchaseStatus: updatePurchaseStatusMutation,
    bulkUpdateStatus: bulkUpdateStatusMutation,
  };
};

export default function PurchasesPage() {
  const { token } = useAuth();
  
  // Local state
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("date");
  const [filterStatus, setFilterStatus] = useState("");
  const [toast, setToast] = useState<ToastType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editPurchase, setEditPurchase] = useState<Purchase | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewPurchase, setViewPurchase] = useState<Purchase | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // React Query hooks
  const {
    purchases,
    pagination,
    isLoading,
    isFetching,
    isPreviousData,
    refetch,
    addPurchase,
    deletePurchases,
    updatePurchaseStatus,
    bulkUpdateStatus,
  } = usePurchases(currentPage, itemsPerPage, search, filterStatus, sortBy);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async () => {
    if (!selected.length) {
      showToast("Please select purchases to delete", "info");
      return;
    }

    try {
      await deletePurchases.mutateAsync(selected);
      showToast(`${selected.length} purchase${selected.length > 1 ? 's' : ''} deleted successfully`);
      setSelected([]);
    } catch (err: any) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  const handleView = (purchase: Purchase) => {
    setViewPurchase(purchase);
    setViewOpen(true);
  };

  const handleModalSubmit = async (form: any) => {
    try {
      if (editPurchase) {
        showToast("Update feature coming soon", "info");
        return;
      }

      await addPurchase.mutateAsync(form);
      showToast("Purchase added successfully", "success");
      setModalOpen(false);
      setEditPurchase(null);
    } catch (err: any) {
      console.error("Error creating purchase:", err.response?.data || err);
      showToast(err.response?.data?.message || "Failed to create purchase", "error");
    }
  };

  const handleAdd = () => {
    setEditPurchase(null);
    setModalOpen(true);
  };

  const handleExport = () => {
    try {
      const headers = ["Invoice #", "Supplier", "Total Items", "Subtotal", "Tax", "Shipping", "Grand Total", "Status", "Payment Status", "Date"];
      const csvData = purchases.map(purchase => {
        const totalQuantity = purchase.items?.reduce((sum: any, item: { quantity: any; }) => sum + item.quantity, 0) || purchase.totalQuantity || 0;
        const subtotal = purchase.subtotal || 0;
        const taxAmount = purchase.taxAmount || 0;
        const shippingCost = purchase.shippingCost || 0;
        const grandTotal = purchase.grandTotal || 0;
        
        return [
          purchase.invoiceNumber || "N/A",
          purchase.supplierName || purchase.supplierId?.name || "N/A",
          totalQuantity,
          subtotal.toFixed(2),
          taxAmount.toFixed(2),
          shippingCost.toFixed(2),
          grandTotal.toFixed(2),
          purchase.status || "N/A",
          purchase.paymentStatus || "N/A",
          new Date(purchase.purchaseDate || purchase.createdAt).toLocaleDateString()
        ];
      });
      
      const csvContent = [
        headers.join(","),
        ...csvData.map(row => row.join(","))
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `purchases_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      showToast("Export completed successfully", "success");
    } catch (error) {
      showToast("Export failed", "error");
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (!selected.length) {
      showToast("Please select purchases to update", "info");
      return;
    }

    try {
      await bulkUpdateStatus.mutateAsync({ ids: selected, status: newStatus });
      showToast(`Status updated to ${newStatus} for ${selected.length} purchase${selected.length > 1 ? 's' : ''}`, "success");
      setSelected([]);
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to update status", "error");
    }
  };

  const handleIndividualStatusUpdate = async (purchase: Purchase, newStatus: string) => {
    try {
      await updatePurchaseStatus.mutateAsync({ id: purchase._id, status: newStatus });
      showToast(`Purchase status updated to ${newStatus}`, "success");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to update status", "error");
    }
  };

  const suggestions = useMemo(() => {
    return purchases.slice(0, 5).map(purchase => ({
      _id: purchase._id,
      name: purchase.invoiceNumber || "N/A",
      category: purchase.status || "N/A"
    }));
  }, [purchases]);

  const statuses = useMemo(() => {
    const uniqueStatuses = new Set<string>(['All', 'Pending', 'Received', 'Cancelled', 'Partially Received']);
    purchases.forEach(purchase => {
      if (purchase.status) {
        uniqueStatuses.add(purchase.status);
      }
    });
    return Array.from(uniqueStatuses);
  }, [purchases]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalSpent = purchases.reduce((sum, p) => sum + (p.grandTotal || 0), 0);
    const totalItems = purchases.reduce((sum, p) => {
      if (p.items) {
        return sum + p.items.reduce((itemSum: any, item: { quantity: any; }) => itemSum + item.quantity, 0);
      }
      return sum + (p.totalQuantity || 0);
    }, 0);
    const pendingCount = purchases.filter(p => p.status === 'Pending').length;
    const receivedCount = purchases.filter(p => p.status === 'Received').length;

    return { totalSpent, totalItems, pendingCount, receivedCount };
  }, [purchases]);

  // Prepare table data
  const tableData = useMemo(() => {
    return purchases.map(p => {
      const totalQuantity = p.items?.reduce((sum: any, item: { quantity: any; }) => sum + item.quantity, 0) || p.totalQuantity || 0;
      const totalItemsCount = p.items?.length || 0;
      
      return {
        ...p,
        _id: p._id,
        invoiceNumber: p.invoiceNumber || "N/A",
        supplier: p.supplierName || p.supplierId?.name || "N/A",
        totalQuantity,
        totalItems: totalItemsCount,
        subtotal: `$${(p.subtotal || 0).toFixed(2)}`,
        tax: `$${(p.taxAmount || 0).toFixed(2)}`,
        shipping: `$${(p.shippingCost || 0).toFixed(2)}`,
        grandTotal: `$${(p.grandTotal || 0).toFixed(2)}`,
        status: p.status || "N/A",
        paymentStatus: p.paymentStatus || "N/A",
        date: new Date(p.purchaseDate || p.createdAt).toLocaleDateString(),
      };
    });
  }, [purchases]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading purchases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 space-y-6">
      {/* Global loading overlay */}
      {(addPurchase.isPending || deletePurchases.isPending || bulkUpdateStatus.isPending || isFetching) && (
        <div className="fixed inset-0 bg-black/10 z-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
            <Loader className="w-6 h-6 text-blue-600 animate-spin" />
            <span className="text-gray-700">
              {addPurchase.isPending ? "Adding purchase..." :
               deletePurchases.isPending ? "Deleting purchases..." :
               bulkUpdateStatus.isPending ? "Updating status..." :
               "Refreshing purchases..."}
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <DataTableHeader
        title="Purchase Management"
        subtitle={`Total Spent: $${stats.totalSpent.toFixed(2)} | Purchases: ${pagination.total}`}
        search={search}
        setSearch={setSearch}
        suggestions={suggestions}
        onAdd={handleAdd}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterCategory={filterStatus}
        setFilterCategory={setFilterStatus}
        categories={statuses}
        showAddButton={true}
        onExport={handleExport}
        selectedCount={selected.length}
        onRefresh={refetch}
        isRefreshing={isFetching}
        onBulkDelete={selected.length > 0 ? handleDelete : undefined}
      />

      {/* Table Actions */}
      {selected.length > 0 && (
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">{selected.length} selected</span>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deletePurchases.isPending}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('Received')}
                  disabled={bulkUpdateStatus.isPending}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-1 disabled:opacity-50"
                >
                  <CheckCircle size={14} />
                  Mark Received
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('Pending')}
                  disabled={bulkUpdateStatus.isPending}
                  className="px-3 py-1.5 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 flex items-center gap-1 disabled:opacity-50"
                >
                  <Clock size={14} />
                  Mark Pending
                </button>
              </div>
            </div>
            <button
              onClick={() => setSelected([])}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && purchases.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Purchases Found</h3>
          <p className="text-gray-500 mb-6">Get started by recording your first purchase</p>
          <button
            onClick={handleAdd}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Purchase
          </button>
        </div>
      ) : (
        <DataTable
          columns={[
            { key: "invoiceNumber", label: "Invoice #", type: "text" },
            { key: "supplier", label: "Supplier", type: "text" },
            { key: "totalItems", label: "Items", type: "number" },
            { key: "totalQuantity", label: "Qty", type: "number" },
            { key: "grandTotal", label: "Total", type: "currency" },
            { key: "status", label: "Status", type: "badge" },
            { key: "paymentStatus", label: "Payment", type: "badge" },
            { key: "date", label: "Date", type: "date" },
          ]}
          data={tableData}
          selected={selected}
          setSelected={setSelected}
          onView={handleView}
          onEdit={handleView} // Edit opens view modal
          showEdit={false}
          showRowMenu={true}
          rowMenuItems={[
            {
              label: "View Details",
              icon: <Eye size={14} />,
              onClick: handleView
            },
            {
              label: "Mark as Received",
              icon: <CheckCircle size={14} />,
              onClick: (purchase) => handleIndividualStatusUpdate(purchase, 'Received')
            },
            {
              label: "Mark as Pending",
              icon: <Clock size={14} />,
              onClick: (purchase) => handleIndividualStatusUpdate(purchase, 'Pending')
            },
            {
              label: "Download Invoice",
              icon: <Download size={14} />,
              onClick: (purchase) => {
                showToast("Invoice download feature coming soon", "info");
              }
            },
            {
              label: "Refresh",
              icon: <RefreshCw size={14} />,
              onClick: () => refetch()
            },
            {
              label: "Delete",
              icon: <Trash2 size={14} />,
              onClick: (purchase) => {
                setSelected([purchase._id]);
                setTimeout(() => handleDelete(), 100);
              },
              variant: 'danger'
            }
          ]}
          // Add pagination props
          pagination={{
            currentPage: pagination.page,
            totalPages: pagination.totalPages,
            totalItems: pagination.total,
            itemsPerPage: pagination.limit,
            onPageChange: handlePageChange,
            onItemsPerPageChange: handleItemsPerPageChange
          }}
          loading={isLoading || isFetching}
        />
      )}

      {/* Modals */}
      <AddPurchaseModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditPurchase(null);
        }}
        onSubmit={handleModalSubmit}
        preSelectedProduct={null}
        isSubmitting={addPurchase.isPending}
      />
      
      <ViewPurchaseModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        data={viewPurchase}
        onStatusUpdate={(id: any, status: any) => updatePurchaseStatus.mutateAsync({ id, status })}
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
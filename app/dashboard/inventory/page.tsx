// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import Toast from "@/components/ui/toast";
// import { DataTableHeader } from "@/components/data-table";
// import DataTableActions from "@/components/data-table/tableAction";
// import DataTable from "@/components/data-table/dataTable";
// import AddEditModal from "./AddEditModal";
// import { ViewProductModal } from "./ViewProductModal";
// import { AddSaleModal } from "../sales/AddSaleModal";
// import { AddPurchaseModal } from "../purchase/AddEditModal";
// import { useAuth } from "@/app/hooks/useAuth";
// import api from "@/app/lib/axios";
// import { Product, ToastType } from "@/components/types";
// import { Edit, Eye } from "lucide-react";

// export default function InventoryPage() {
//   const router = useRouter();
//   const { token, user } = useAuth();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState<string[]>([]);
//   const [sortBy, setSortBy] = useState("name");
//   const [filterCategory, setFilterCategory] = useState("");
//   const [toast, setToast] = useState<ToastType | null>(null);
//   const [addEditModalOpen, setAddEditModalOpen] = useState(false);
//   const [saleModalOpen, setSaleModalOpen] = useState(false);
//   const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
//   const [editProduct, setEditProduct] = useState<Product | null>(null);
//   const [viewOpen, setViewOpen] = useState(false);
//   const [viewProduct, setViewProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [selectedProductForSale, setSelectedProductForSale] = useState<Product[] | null>(null);
//   const [selectedProductForPurchase, setSelectedProductForPurchase] = useState<Product | null>(null);

//   const showToast = (
//     message: string,
//     type: "success" | "error" | "info" = "success"
//   ) => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   useEffect(() => {
//     if (!token && !user) {
//       router.push("/login");
//     }
//   }, [token, user, router]);

//   const fetchProducts = async () => {
//     if (!token) return;
    
//     setLoading(true);
//     try {
//       const res = await api.get("/inventory");
//       setProducts(res.data.data || []);
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || "Failed to fetch inventory";
//       showToast(errorMessage, "error");
      
//       if (err.response?.status === 401) {
//         setTimeout(() => router.push("/login"), 2000);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchProducts();
//     }
//   }, [token]);

//   // DEFINE handleAddSale BEFORE it's used
//   const handleAddSale = async (saleData: any) => {
//     if (!token) {
//       showToast("Please login first", "error");
//       return;
//     }

//     try {
//       console.log("Sale Data received:", saleData);

//       // The backend now accepts the format directly from AddSaleModal
//       // No need to reformat - just send as is
//       const response = await api.post("/sales", saleData);
//       console.log("API Response:", response.data);
      
//       showToast("Sale recorded successfully", "success");
//       setSaleModalOpen(false);
//       setSelectedProductForSale(null);
//       fetchProducts(); // Refresh inventory
//       return response.data.data;
//     } catch (err: any) {
//       console.error("Sale Error:", err);
//       console.error("Error Response:", err.response?.data);
      
//       const errorMessage = err.response?.data?.message || "Failed to record sale";
//       showToast(errorMessage, "error");
//       throw err;
//     }
//   };

//   const handleBulkSale = () => {
//     if (selected.length === 0) {
//       showToast("Please select products to sell", "info");
//       return;
//     }
    
//     // Get selected products from the products list
//     const selectedProducts = products.filter(product => selected.includes(product._id));
//     console.log("Selected products for bulk sale:", selectedProducts);
    
//     if (selectedProducts.length === 0) {
//       showToast("No products found for selected items", "error");
//       return;
//     }
    
//     setSelectedProductForSale(selectedProducts);
//     setSaleModalOpen(true);
//   };

//   const handleDelete = async () => {
//     if (!selected.length || !token) return;

//     setDeleteLoading(true);
//     try {
//       await api.delete("/inventory", {
//         data: { ids: selected },
//       });
//       showToast(`${selected.length} product${selected.length > 1 ? 's' : ''} deleted successfully`);
//       setSelected([]);
//       fetchProducts();
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || "Delete failed";
//       showToast(errorMessage, "error");
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const handleModalSubmit = async (form: Omit<Product, "_id">) => {
//     if (!token) {
//       showToast("Please login first", "error");
//       return;
//     }

//     try {
//       if (editProduct) {
//         await api.put(`/inventory/${editProduct._id}`, {
//           ...form,
//           salePrice: form.salePrice,
//           costPrice: form.costPrice || 0
//         });
//         showToast("Product updated successfully");
//       } else {
//         await api.post("/inventory", {
//           ...form,
//           salePrice: form.salePrice,
//           costPrice: form.costPrice || 0
//         });
//         showToast("Product added successfully");
//       }
//       setAddEditModalOpen(false);
//       setEditProduct(null);
//       fetchProducts();
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || "Operation failed";
//       showToast(errorMessage, "error");
//     }
//   };

//   const handleAddPurchase = async (purchaseData: any) => {
//     if (!token) {
//       showToast("Please login first", "error");
//       return;
//     }

//     try {
//       // Prepare the data in the format your backend expects
//       const formattedData = {
//         supplierName: purchaseData.supplierName,
//         supplierContact: purchaseData.supplierContact || "",
//         items: purchaseData.items.map((item: any) => ({
//           productId: item.productId,
//           productName: item.productName,
//           quantity: item.quantity,
//           unitCost: item.unitCost,
//           expiryDate: item.expiryDate || null,
//           batchNumber: item.batchNumber || "",
//         })),
//         tax: purchaseData.tax,
//         shippingCost: purchaseData.shippingCost,
//         otherCharges: purchaseData.otherCharges,
//         paymentMethod: purchaseData.paymentMethod,
//         paymentStatus: purchaseData.paymentStatus,
//         expectedDelivery: purchaseData.expectedDelivery || null,
//         notes: purchaseData.notes || "",
//         status: purchaseData.status,
//       };

//       const response = await api.post("/purchases", formattedData);
//       showToast("Purchase recorded successfully", "success");
//       setPurchaseModalOpen(false);
//       setSelectedProductForPurchase(null);
//       fetchProducts(); // Refresh inventory to update stock
//       return response.data.data;
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || "Failed to record purchase";
//       showToast(errorMessage, "error");
//       throw err;
//     }
//   };

//   const handleEdit = (product: Product) => {
//     setEditProduct(product);
//     setAddEditModalOpen(true);
//   };

//   const handleAdd = () => {
//     setEditProduct(null);
//     setAddEditModalOpen(true);
//   };

//   const handleView = (product: Product) => {
//     setViewProduct(product);
//     setViewOpen(true);
//   };

//   const handleQuickSale = (product: Product) => {
//     console.log("Quick sale for:", product);
//     setSelectedProductForSale([product]);
//     setSaleModalOpen(true);
//   };

//   const handleQuickPurchase = (product: Product) => {
//     setSelectedProductForPurchase(product);
//     setPurchaseModalOpen(true);
//   };

//   const handleExport = () => {
//     try {
//       const headers = ["Name", "Category", "Stock", "Cost Price", "Sale Price", "Profit Margin", "Expiry"];
//       const csvData = filtered.map(product => {
//         const profitMargin = product.costPrice > 0 
//           ? ((product.salePrice - product.costPrice) / product.costPrice * 100).toFixed(1)
//           : "0";
        
//         return [
//           product.name,
//           product.category,
//           product.stock,
//           product.costPrice || 0,
//           product.salePrice,
//           profitMargin,
//           new Date(product.expiry).toLocaleDateString()
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
//       a.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
      
//       showToast("Export completed successfully", "success");
//     } catch (error) {
//       showToast("Export failed", "error");
//     }
//   };

//   const filtered = useMemo(() => {
//     let result = products.filter(
//       (p) =>
//         p.name.toLowerCase().includes(search.toLowerCase()) &&
//         (filterCategory === "" || p.category === filterCategory)
//     );

//     result.sort((a, b) => {
//       if (sortBy === "stock") return b.stock - a.stock;
//       if (sortBy === "price") return b.salePrice - a.salePrice;
//       if (sortBy === "expiry")
//         return new Date(a.expiry).getTime() - new Date(b.expiry).getTime();
//       if (sortBy === "profit") {
//         const marginA = a.costPrice > 0 ? ((a.salePrice - a.costPrice) / a.costPrice) * 100 : 0;
//         const marginB = b.costPrice > 0 ? ((b.salePrice - b.costPrice) / b.costPrice) * 100 : 0;
//         return marginB - marginA;
//       }
//       return a.name.localeCompare(b.name);
//     });

//     return result;
//   }, [products, search, sortBy, filterCategory]);

//   const categories = [...new Set(products.map((p) => p.category))];

//   const totalValue = useMemo(() => 
//     products.reduce((sum, p) => sum + (p.stock * p.salePrice), 0), 
//     [products]
//   );

//   const lowStockCount = useMemo(() => 
//     products.filter(p => p.stock < 50).length, 
//     [products]
//   );

//   if (!token) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Redirecting to login...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 space-y-6">
//       {loading && (
//         <div className="fixed inset-0 bg-black/10 z-40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
//             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//             <span className="text-gray-700">Loading inventory...</span>
//           </div>
//         </div>
//       )}

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Products</p>
//               <p className="text-2xl font-bold text-gray-900">{products.length}</p>
//             </div>
//             <div className="p-3 bg-blue-100 rounded-lg">
//               <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//               </svg>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Value</p>
//               <p className="text-2xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
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
//               <p className="text-sm text-gray-500">Low Stock</p>
//               <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
//             </div>
//             <div className="p-3 bg-red-100 rounded-lg">
//               <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.204 16.5c-.77.833.192 2.5 1.732 2.5z" />
//               </svg>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Categories</p>
//               <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
//             </div>
//             <div className="p-3 bg-purple-100 rounded-lg">
//               <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>

//       <DataTableHeader
//         title="Inventory Management"
//         subtitle={`Total Value: $${totalValue.toFixed(2)} | Products: ${products.length}`}
//         search={search}
//         setSearch={setSearch}
//         suggestions={filtered}
//         onAdd={handleAdd}
//         sortBy={sortBy}
//         setSortBy={setSortBy}
//         filterCategory={filterCategory}
//         setFilterCategory={setFilterCategory}
//         categories={categories}
//         showAddButton={true}
//         onExport={handleExport}
//         onQuickSale={() => setSaleModalOpen(true)}
//         onQuickPurchase={() => setPurchaseModalOpen(true)}
//         onBulkSale={handleBulkSale}
//         selectedCount={selected.length}
//       />

//       {!loading && products.length === 0 ? (
//         <div className="bg-white rounded-xl border p-12 text-center">
//           <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
//             <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//             </svg>
//           </div>
//           <h3 className="text-xl font-bold text-gray-800 mb-2">No Products Found</h3>
//           <p className="text-gray-500 mb-6">Get started by adding your first product</p>
//           <div className="flex gap-3 justify-center">
//             <button
//               onClick={handleAdd}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//             >
//               <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               Add Product
//             </button>
//             <button
//               onClick={() => setPurchaseModalOpen(true)}
//               className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
//             >
//               <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//               </svg>
//               Quick Purchase
//             </button>
//           </div>
//         </div>
//       ) : (
//         <DataTable
//           columns={[
//             { key: "name", label: "Product", type: "text" },
//             { key: "category", label: "Category", type: "text" },
//             { key: "stock", label: "Stock", type: "number" },
//             { key: "costPrice", label: "Cost Price", type: "currency" },
//             { key: "salePrice", label: "Sale Price", type: "currency" },
//             { key: "profitMargin", label: "Margin", type: "text" },
//             { key: "expiry", label: "Expiry Date", type: "date" },
//           ]}
//           data={filtered.map(p => ({
//             ...p,
//             profitMargin: p.costPrice > 0 
//               ? (((p.salePrice - p.costPrice) / p.costPrice) * 100).toFixed(1) + "%"
//               : "N/A"
//           }))}
//           selected={selected}
//           setSelected={setSelected}
//           onEdit={handleEdit}
//           onView={handleView}
//           onQuickSale={handleQuickSale}
//           onQuickPurchase={handleQuickPurchase}
//           showEdit={true}
//           showRowMenu={true}
//           rowMenuItems={[
//             {
//               label: "View Details",
//               icon: <Eye size={14} />,
//               onClick: handleView
//             },
//             {
//               label: "Edit Product",
//               icon: <Edit size={14} />,
//               onClick: handleEdit
//             },
//              {
//               label: "Quick Sale",
//               icon: (
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               ),
//               onClick: handleQuickSale
//             },
//             {
//               label: "Quick Purchase",
//               icon: (
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//                 </svg>
//               ),
//               onClick: handleQuickPurchase
//             },
//             {
//               label: "Delete",
//               icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//               </svg>,
//               onClick: (product) => {
//                 setSelected([product._id]);
//                 setTimeout(() => handleDelete(), 100);
//               },
//               variant: 'danger'
//             }
//           ]}
//         />
//       )}

//       {/* Modals */}
//       <AddEditModal
//         open={addEditModalOpen}
//         onClose={() => {
//           setAddEditModalOpen(false);
//           setEditProduct(null);
//         }}
//         onSubmit={handleModalSubmit}
//         product={editProduct}
//       />

//       <ViewProductModal
//         open={viewOpen}
//         onClose={() => setViewOpen(false)}
//         product={viewProduct}
//       />

//       <AddSaleModal
//         open={saleModalOpen}
//         onClose={() => {
//           setSaleModalOpen(false);
//           setSelectedProductForSale(null);
//         }}
//         onSubmit={handleAddSale}
//         onPrintInvoice={(saleId) => {
//           const invoiceUrl = `/api/sales/invoice/${saleId}`;
//           window.open(invoiceUrl, '_blank');
//         }}
//         preSelectedProducts={selectedProductForSale}
//       />

//       <AddPurchaseModal
//         open={purchaseModalOpen}
//         onClose={() => {
//           setPurchaseModalOpen(false);
//           setSelectedProductForPurchase(null);
//         }}
//         onSubmit={handleAddPurchase}
//         preSelectedProduct={selectedProductForPurchase}
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

// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import Toast from "@/components/ui/toast";
// import { DataTableHeader } from "@/components/data-table";
// import DataTable from "@/components/data-table/dataTable";
// import AddEditModal from "./AddEditModal";
// import { ViewProductModal } from "./ViewProductModal";
// import { AddSaleModal } from "../sales/AddSaleModal";
// import { AddPurchaseModal } from "../purchase/AddEditModal";
// import { useAuth } from "@/app/hooks/useAuth";
// import api from "@/app/lib/axios";
// import { Product, ToastType } from "@/components/types";
// import { Edit, Eye, ShoppingCart, TrendingUp } from "lucide-react";

// export default function InventoryPage() {
//   const router = useRouter();
//   const { token, user } = useAuth();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState<string[]>([]);
//   const [sortBy, setSortBy] = useState("name");
//   const [filterCategory, setFilterCategory] = useState("");
//   const [toast, setToast] = useState<ToastType | null>(null);
//   const [addEditModalOpen, setAddEditModalOpen] = useState(false);
//   const [saleModalOpen, setSaleModalOpen] = useState(false);
//   const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
//   const [editProduct, setEditProduct] = useState<Product | null>(null);
//   const [viewOpen, setViewOpen] = useState(false);
//   const [viewProduct, setViewProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [selectedProductForSale, setSelectedProductForSale] = useState<Product[] | null>(null);
//   const [selectedProductForPurchase, setSelectedProductForPurchase] = useState<Product | null>(null);

//   const showToast = (
//     message: string,
//     type: "success" | "error" | "info" = "success"
//   ) => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   useEffect(() => {
//     if (!token && !user) {
//       router.push("/login");
//     }
//   }, [token, user, router]);

//   const fetchProducts = async () => {
//     if (!token) return;
    
//     setLoading(true);
//     try {
//       const res = await api.get("/inventory");
//       setProducts(res.data.data || []);
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || "Failed to fetch inventory";
//       showToast(errorMessage, "error");
      
//       if (err.response?.status === 401) {
//         setTimeout(() => router.push("/login"), 2000);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchProducts();
//     }
//   }, [token]);

//   const handleAddSale = async (saleData: any) => {
//     if (!token) {
//       showToast("Please login first", "error");
//       return;
//     }

//     try {
//       const response = await api.post("/sales", saleData);
//       showToast("Sale recorded successfully", "success");
//       setSaleModalOpen(false);
//       setSelectedProductForSale(null);
//       fetchProducts();
//       return response.data.data;
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || "Failed to record sale";
//       showToast(errorMessage, "error");
//       throw err;
//     }
//   };

// const handleAddPurchase = async (purchaseData: any) => {
//   if (!token) {
//     showToast("Please login first", "error");
//     return;
//   }

//   try {
//     console.log("Raw purchase data from modal:", purchaseData);
    
//     // Format the data properly
//     const formattedData = {
//       supplierName: purchaseData.supplierName,
//       supplierContact: purchaseData.supplierContact || "",
//       items: purchaseData.items.map((item: any) => ({
//         productId: item.productId || null,
//         productName: item.productName,
//         quantity: parseInt(item.quantity) || 1,
//         unitCost: parseFloat(item.unitCost) || 0,
//         expiryDate: item.expiryDate, // REQUIRED - must be provided
//         batchNumber: item.batchNumber || `BATCH-${Date.now().toString(36).slice(-6)}`,
//       })),
//       tax: parseFloat(purchaseData.tax) || 0,
//       shippingCost: parseFloat(purchaseData.shippingCost) || 0,
//       otherCharges: parseFloat(purchaseData.otherCharges) || 0,
//       paymentMethod: purchaseData.paymentMethod || "Cash",
//       paymentStatus: purchaseData.paymentStatus || "Paid",
//       expectedDelivery: purchaseData.expectedDelivery || null,
//       notes: purchaseData.notes || "",
//       status: purchaseData.status || "Received",
//     };

//     console.log("Formatted purchase data for API:", formattedData);

//     const response = await api.post("/purchases", formattedData);
//     showToast("Purchase recorded successfully", "success");
//     setPurchaseModalOpen(false);
//     setSelectedProductForPurchase(null);
//     fetchProducts();
//     return response.data.data;
//   } catch (err: any) {
//     console.error("Purchase error details:", {
//       message: err.message,
//       response: err.response?.data,
//       status: err.response?.status
//     });
//     const errorMessage = err.response?.data?.message || err.message || "Failed to record purchase";
//     showToast(errorMessage, "error");
//     throw err;
//   }
// };

//   const handleBulkSale = () => {
//     if (selected.length === 0) {
//       showToast("Please select products to sell", "info");
//       return;
//     }
    
//     const selectedProducts = products.filter(product => selected.includes(product._id));
//     if (selectedProducts.length === 0) {
//       showToast("No products found for selected items", "error");
//       return;
//     }
    
//     setSelectedProductForSale(selectedProducts);
//     setSaleModalOpen(true);
//   };

//   const handleBulkPurchase = () => {
//     if (selected.length === 0) {
//       showToast("Please select products to purchase", "info");
//       return;
//     }
    
//     const selectedProducts = products.filter(product => selected.includes(product._id));
//     if (selectedProducts.length === 0) {
//       showToast("No products found for selected items", "error");
//       return;
//     }
    
//     // For bulk purchase, we'll use the first product as template
//     setSelectedProductForPurchase(selectedProducts[0]);
//     setPurchaseModalOpen(true);
//   };

//   const handleDelete = async () => {
//     if (!selected.length || !token) return;

//     setDeleteLoading(true);
//     try {
//       await api.delete("/inventory", {
//         data: { ids: selected },
//       });
//       showToast(`${selected.length} product${selected.length > 1 ? 's' : ''} deleted successfully`);
//       setSelected([]);
//       fetchProducts();
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || "Delete failed";
//       showToast(errorMessage, "error");
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const handleModalSubmit = async (form: Omit<Product, "_id">) => {
//     if (!token) {
//       showToast("Please login first", "error");
//       return;
//     }

//     try {
//       if (editProduct) {
//         await api.put(`/inventory/${editProduct._id}`, {
//           ...form,
//           salePrice: form.salePrice,
//           costPrice: form.costPrice || 0
//         });
//         showToast("Product updated successfully");
//       } else {
//         await api.post("/inventory", {
//           ...form,
//           salePrice: form.salePrice,
//           costPrice: form.costPrice || 0
//         });
//         showToast("Product added successfully");
//       }
//       setAddEditModalOpen(false);
//       setEditProduct(null);
//       fetchProducts();
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || "Operation failed";
//       showToast(errorMessage, "error");
//     }
//   };

//   const handleEdit = (product: Product) => {
//     setEditProduct(product);
//     setAddEditModalOpen(true);
//   };

//   const handleAdd = () => {
//     setEditProduct(null);
//     setAddEditModalOpen(true);
//   };

//   const handleView = (product: Product) => {
//     setViewProduct(product);
//     setViewOpen(true);
//   };

//   const handleQuickSale = (product: Product) => {
//     setSelectedProductForSale([product]);
//     setSaleModalOpen(true);
//   };

//   const handleQuickPurchase = (product: Product) => {
//     setSelectedProductForPurchase(product);
//     setPurchaseModalOpen(true);
//   };

//   const handleExport = () => {
//     try {
//       const headers = ["Name", "Category", "Stock", "Cost Price", "Sale Price", "Profit Margin", "Expiry"];
//       const csvData = filtered.map(product => {
//         const profitMargin = product.costPrice > 0 
//           ? ((product.salePrice - product.costPrice) / product.costPrice * 100).toFixed(1)
//           : "0";
        
//         return [
//           product.name,
//           product.category,
//           product.stock,
//           product.costPrice || 0,
//           product.salePrice,
//           profitMargin,
//           new Date(product.expiry).toLocaleDateString()
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
//       a.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
      
//       showToast("Export completed successfully", "success");
//     } catch (error) {
//       showToast("Export failed", "error");
//     }
//   };

//   const filtered = useMemo(() => {
//     let result = products.filter(
//       (p) =>
//         p.name.toLowerCase().includes(search.toLowerCase()) &&
//         (filterCategory === "" || p.category === filterCategory)
//     );

//     result.sort((a, b) => {
//       if (sortBy === "stock") return b.stock - a.stock;
//       if (sortBy === "price") return b.salePrice - a.salePrice;
//       if (sortBy === "expiry")
//         return new Date(a.expiry).getTime() - new Date(b.expiry).getTime();
//       if (sortBy === "profit") {
//         const marginA = a.costPrice > 0 ? ((a.salePrice - a.costPrice) / a.costPrice) * 100 : 0;
//         const marginB = b.costPrice > 0 ? ((b.salePrice - b.costPrice) / b.costPrice) * 100 : 0;
//         return marginB - marginA;
//       }
//       return a.name.localeCompare(b.name);
//     });

//     return result;
//   }, [products, search, sortBy, filterCategory]);

//   const categories = [...new Set(products.map((p) => p.category))];

//   const totalValue = useMemo(() => 
//     products.reduce((sum, p) => sum + (p.stock * p.salePrice), 0), 
//     [products]
//   );

//   const lowStockCount = useMemo(() => 
//     products.filter(p => p.stock < 50).length, 
//     [products]
//   );

//   if (!token) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Redirecting to login...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 space-y-6">
//       {loading && (
//         <div className="fixed inset-0 bg-black/10 z-40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
//             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//             <span className="text-gray-700">Loading inventory...</span>
//           </div>
//         </div>
//       )}

//       {/* Stats Cards */}
//       {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Products</p>
//               <p className="text-2xl font-bold text-gray-900">{products.length}</p>
//             </div>
//             <div className="p-3 bg-blue-100 rounded-lg">
//               <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//               </svg>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Value</p>
//               <p className="text-2xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
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
//               <p className="text-sm text-gray-500">Low Stock</p>
//               <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
//             </div>
//             <div className="p-3 bg-red-100 rounded-lg">
//               <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.204 16.5c-.77.833.192 2.5 1.732 2.5z" />
//               </svg>
//             </div>
//           </div>
//         </div>
        
//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Categories</p>
//               <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
//             </div>
//             <div className="p-3 bg-purple-100 rounded-lg">
//               <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div> */}

//       <DataTableHeader
//         title="Inventory Management"
//         subtitle={`Total Value: $${totalValue.toFixed(2)} | Products: ${products.length}`}
//         search={search}
//         setSearch={setSearch}
//         suggestions={filtered}
//         onAdd={handleAdd}
//         sortBy={sortBy}
//         setSortBy={setSortBy}
//         filterCategory={filterCategory}
//         setFilterCategory={setFilterCategory}
//         categories={categories}
//         showAddButton={true}
//         onExport={handleExport}
//         onQuickSale={() => {
//           if (selected.length > 0) {
//             handleBulkSale();
//           } else {
//             setSaleModalOpen(true);
//           }
//         }}
//         onQuickPurchase={() => {
//           if (selected.length > 0) {
//             handleBulkPurchase();
//           } else {
//             setPurchaseModalOpen(true);
//           }
//         }}
//         onBulkSale={handleBulkSale}
//         onBulkPurchase={handleBulkPurchase}
//         selectedCount={selected.length}
//       />

//       {!loading && products.length === 0 ? (
//         <div className="bg-white rounded-xl border p-12 text-center">
//           <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
//             <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
//             </svg>
//           </div>
//           <h3 className="text-xl font-bold text-gray-800 mb-2">No Products Found</h3>
//           <p className="text-gray-500 mb-6">Get started by adding your first product</p>
//           <div className="flex gap-3 justify-center">
//             <button
//               onClick={handleAdd}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//             >
//               <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               Add Product
//             </button>
//             <button
//               onClick={() => setPurchaseModalOpen(true)}
//               className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
//             >
//               <ShoppingCart className="w-5 h-5 inline mr-2" />
//               Quick Purchase
//             </button>
//           </div>
//         </div>
//       ) : (
//         <DataTable
//           columns={[
//             { key: "name", label: "Product", type: "text" },
//             { key: "category", label: "Category", type: "text" },
//             { key: "stock", label: "Stock", type: "number" },
//             { key: "costPrice", label: "Cost Price", type: "currency" },
//             { key: "salePrice", label: "Sale Price", type: "currency" },
//             { key: "profitMargin", label: "Margin", type: "text" },
//             { key: "expiry", label: "Expiry Date", type: "date" },
//           ]}
//           data={filtered.map(p => ({
//             ...p,
//             profitMargin: p.costPrice > 0 
//               ? (((p.salePrice - p.costPrice) / p.costPrice) * 100).toFixed(1) + "%"
//               : "N/A"
//           }))}
//           selected={selected}
//           setSelected={setSelected}
//           onEdit={handleEdit}
//           onView={handleView}
//           onQuickSale={handleQuickSale}
//           onQuickPurchase={handleQuickPurchase}
//           showEdit={true}
//           showRowMenu={true}
//           rowMenuItems={[
//             {
//               label: "View Details",
//               icon: <Eye size={14} />,
//               onClick: handleView
//             },
//             {
//               label: "Edit Product",
//               icon: <Edit size={14} />,
//               onClick: handleEdit
//             },
//             {
//               label: "Quick Sale",
//               icon: <TrendingUp size={14} />,
//               onClick: handleQuickSale
//             },
//             {
//               label: "Quick Purchase",
//               icon: <ShoppingCart size={14} />,
//               onClick: handleQuickPurchase
//             },
//             {
//               label: "Delete",
//               icon: (
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                 </svg>
//               ),
//               onClick: (product) => {
//                 setSelected([product._id]);
//                 setTimeout(() => handleDelete(), 100);
//               },
//               variant: 'danger'
//             }
//           ]}
//         />
//       )}

//       {/* Modals */}
//       <AddEditModal
//         open={addEditModalOpen}
//         onClose={() => {
//           setAddEditModalOpen(false);
//           setEditProduct(null);
//         }}
//         onSubmit={handleModalSubmit}
//         product={editProduct}
//       />

//       <ViewProductModal
//         open={viewOpen}
//         onClose={() => setViewOpen(false)}
//         product={viewProduct}
//       />

//       <AddSaleModal
//         open={saleModalOpen}
//         onClose={() => {
//           setSaleModalOpen(false);
//           setSelectedProductForSale(null);
//         }}
//         onSubmit={handleAddSale}
//         onPrintInvoice={(saleId) => {
//           const invoiceUrl = `/api/sales/invoice/${saleId}`;
//           window.open(invoiceUrl, '_blank');
//         }}
//         preSelectedProducts={selectedProductForSale}
//       />

//       <AddPurchaseModal
//         open={purchaseModalOpen}
//         onClose={() => {
//           setPurchaseModalOpen(false);
//           setSelectedProductForPurchase(null);
//         }}
//         onSubmit={handleAddPurchase}
//         preSelectedProduct={selectedProductForPurchase}
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

"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/toast";
import { DataTableHeader } from "@/components/data-table";
import DataTable from "@/components/data-table/dataTable";
import AddEditModal from "./AddEditModal";
import { ViewProductModal } from "./ViewProductModal";
import { AddSaleModal } from "../sales/AddSaleModal";
import { AddPurchaseModal } from "../purchase/AddEditModal";
import { useAuth } from "@/app/hooks/useAuth";
import api from "@/app/lib/axios";
import { Product, ToastType } from "@/components/types";
import { Edit, Eye, ShoppingCart, TrendingUp, Loader } from "lucide-react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useInventoryData } from "@/app/hooks/useApiData";

// Custom hook for inventory operations
const useInventory = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Use app data hook for products
  const {
    products,
    isLoading,
    isFetching,
    isPreviousData,
    refetch: refetchInventory
  } = useInventoryData();

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (productData: Omit<Product, "_id">) => {
      const res = await api.post("/inventory", {
        ...productData,
        salePrice: productData.salePrice,
        costPrice: productData.costPrice || 0
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-data'] });
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<Product> }) => {
      const res = await api.put(`/inventory/${id}`, {
        ...data,
        salePrice: data.salePrice,
        costPrice: data.costPrice || 0
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-data'] });
    },
  });

  // Delete products mutation
  const deleteProductsMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete("/inventory", { data: { ids } });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-data'] });
    },
  });

  // Add sale mutation
  const addSaleMutation = useMutation({
    mutationFn: async (saleData: any) => {
      const res = await api.post("/sales", saleData);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-data'] });
    },
  });

  // Add purchase mutation
  const addPurchaseMutation = useMutation({
    mutationFn: async (purchaseData: any) => {
      const formattedData = {
        supplierName: purchaseData.supplierName,
        supplierContact: purchaseData.supplierContact || "",
        items: purchaseData.items.map((item: any) => ({
          productId: item.productId || null,
          productName: item.productName,
          quantity: parseInt(item.quantity) || 1,
          unitCost: parseFloat(item.unitCost) || 0,
          expiryDate: item.expiryDate,
          batchNumber: item.batchNumber || `BATCH-${Date.now().toString(36).slice(-6)}`,
        })),
        tax: parseFloat(purchaseData.tax) || 0,
        shippingCost: parseFloat(purchaseData.shippingCost) || 0,
        otherCharges: parseFloat(purchaseData.otherCharges) || 0,
        paymentMethod: purchaseData.paymentMethod || "Cash",
        paymentStatus: purchaseData.paymentStatus || "Paid",
        expectedDelivery: purchaseData.expectedDelivery || null,
        notes: purchaseData.notes || "",
        status: purchaseData.status || "Received",
      };

      const res = await api.post("/purchases", formattedData);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-data'] });
    },
  });

  return {
    products,
    isLoading,
    isFetching,
    isPreviousData,
    refetch: refetchInventory,
    addProduct: addProductMutation,
    updateProduct: updateProductMutation,
    deleteProducts: deleteProductsMutation,
    addSale: addSaleMutation,
    addPurchase: addPurchaseMutation,
  };
};

export default function InventoryPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  
  // Local state
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("name");
  const [filterCategory, setFilterCategory] = useState("");
  const [toast, setToast] = useState<ToastType | null>(null);
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [selectedProductForSale, setSelectedProductForSale] = useState<Product[] | null>(null);
  const [selectedProductForPurchase, setSelectedProductForPurchase] = useState<Product | null>(null);

  // React Query hooks
  const {
    products,
    isLoading,
    isFetching,
    isPreviousData,
    refetch,
    addProduct,
    updateProduct,
    deleteProducts,
    addSale,
    addPurchase,
  } = useInventory();

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Redirect if not authenticated
  if (!token && !user) {
    router.push("/login");
    return null;
  }

  // Sale handler
  const handleAddSale = async (saleData: any) => {
    if (!token) {
      showToast("Please login first", "error");
      return;
    }

    try {
      const result = await addSale.mutateAsync(saleData);
      showToast("Sale recorded successfully", "success");
      setSaleModalOpen(false);
      setSelectedProductForSale(null);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to record sale";
      showToast(errorMessage, "error");
      throw err;
    }
  };

  // Purchase handler
  const handleAddPurchase = async (purchaseData: any) => {
    if (!token) {
      showToast("Please login first", "error");
      return;
    }

    try {
      const result = await addPurchase.mutateAsync(purchaseData);
      showToast("Purchase recorded successfully", "success");
      setPurchaseModalOpen(false);
      setSelectedProductForPurchase(null);
      return result;
    } catch (err: any) {
      console.error("Purchase error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to record purchase";
      showToast(errorMessage, "error");
      throw err;
    }
  };

  // Bulk operations
  const handleBulkSale = () => {
    if (selected.length === 0) {
      showToast("Please select products to sell", "info");
      return;
    }
    
    const selectedProducts = products.filter(product => selected.includes(product._id));
    if (selectedProducts.length === 0) {
      showToast("No products found for selected items", "error");
      return;
    }
    
    setSelectedProductForSale(selectedProducts);
    setSaleModalOpen(true);
  };

  const handleBulkPurchase = () => {
    if (selected.length === 0) {
      showToast("Please select products to purchase", "info");
      return;
    }
    
    const selectedProducts = products.filter(product => selected.includes(product._id));
    if (selectedProducts.length === 0) {
      showToast("No products found for selected items", "error");
      return;
    }
    
    setSelectedProductForPurchase(selectedProducts[0]);
    setPurchaseModalOpen(true);
  };

  // Delete handler
  const handleDelete = async () => {
    if (!selected.length || !token) return;

    try {
      await deleteProducts.mutateAsync(selected);
      showToast(`${selected.length} product${selected.length > 1 ? 's' : ''} deleted successfully`);
      setSelected([]);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Delete failed";
      showToast(errorMessage, "error");
    }
  };

  // Add/Edit handler
  const handleModalSubmit = async (form: Omit<Product, "_id">) => {
    if (!token) {
      showToast("Please login first", "error");
      return;
    }

    try {
      if (editProduct) {
        await updateProduct.mutateAsync({
          id: editProduct._id,
          data: form
        });
        showToast("Product updated successfully");
      } else {
        await addProduct.mutateAsync(form);
        showToast("Product added successfully");
      }
      setAddEditModalOpen(false);
      setEditProduct(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Operation failed";
      showToast(errorMessage, "error");
    }
  };

  // Action handlers
  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setAddEditModalOpen(true);
  };

  const handleAdd = () => {
    setEditProduct(null);
    setAddEditModalOpen(true);
  };

  const handleView = (product: Product) => {
    setViewProduct(product);
    setViewOpen(true);
  };

  const handleQuickSale = (product: Product) => {
    setSelectedProductForSale([product]);
    setSaleModalOpen(true);
  };

  const handleQuickPurchase = (product: Product) => {
    setSelectedProductForPurchase(product);
    setPurchaseModalOpen(true);
  };

  // Export handler
  const handleExport = () => {
    try {
      const headers = ["Name", "Category", "Stock", "Cost Price", "Sale Price", "Profit Margin", "Expiry"];
      const csvData = filtered.map(product => {
        const profitMargin = product.costPrice > 0 
          ? ((product.salePrice - product.costPrice) / product.costPrice * 100).toFixed(1)
          : "0";
        
        return [
          product.name,
          product.category,
          product.stock,
          product.costPrice || 0,
          product.salePrice,
          profitMargin,
          new Date(product.expiry).toLocaleDateString()
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
      a.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      showToast("Export completed successfully", "success");
    } catch (error) {
      showToast("Export failed", "error");
    }
  };

  // Filtered and sorted products
  const filtered = useMemo(() => {
    let result = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (filterCategory === "" || p.category === filterCategory)
    );

    result.sort((a, b) => {
      if (sortBy === "stock") return b.stock - a.stock;
      if (sortBy === "price") return b.salePrice - a.salePrice;
      if (sortBy === "expiry")
        return new Date(a.expiry).getTime() - new Date(b.expiry).getTime();
      if (sortBy === "profit") {
        const marginA = a.costPrice > 0 ? ((a.salePrice - a.costPrice) / a.costPrice) * 100 : 0;
        const marginB = b.costPrice > 0 ? ((b.salePrice - b.costPrice) / b.costPrice) * 100 : 0;
        return marginB - marginA;
      }
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [products, search, sortBy, filterCategory]);

  const categories = [...new Set(products.map((p) => p.category))];
  const totalValue = useMemo(() => 
    products.reduce((sum, p) => sum + (p.stock * p.salePrice), 0), 
    [products]
  );
  const lowStockCount = useMemo(() => 
    products.filter(p => p.stock < 50).length, 
    [products]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 space-y-6">
      {/* Global loading overlay */}
      {(addProduct.isPending || updateProduct.isPending || deleteProducts.isPending || isFetching) && (
        <div className="fixed inset-0 bg-black/10 z-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
            <Loader className="w-6 h-6 text-blue-600 animate-spin" />
            <span className="text-gray-700">
              {addProduct.isPending ? "Adding product..." :
               updateProduct.isPending ? "Updating product..." :
               deleteProducts.isPending ? "Deleting products..." :
               "Refreshing inventory..."}
            </span>
          </div>
        </div>
      )}

      {/* Data Table Header */}
      <DataTableHeader
        title="Inventory Management"
        subtitle={`Total Value: $${totalValue.toFixed(2)} | Products: ${products.length}`}
        search={search}
        setSearch={setSearch}
        suggestions={filtered}
        onAdd={handleAdd}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        categories={categories}
        showAddButton={true}
        onExport={handleExport}
        onQuickSale={() => {
          if (selected.length > 0) {
            handleBulkSale();
          } else {
            setSaleModalOpen(true);
          }
        }}
        onQuickPurchase={() => {
          if (selected.length > 0) {
            handleBulkPurchase();
          } else {
            setPurchaseModalOpen(true);
          }
        }}
        onBulkSale={handleBulkSale}
        onBulkPurchase={handleBulkPurchase}
        selectedCount={selected.length}
        onRefresh={refetch}
        isRefreshing={isFetching}
      />

      {/* Empty state */}
      {!isLoading && products.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Products Found</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first product</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleAdd}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Product
            </button>
            <button
              onClick={() => setPurchaseModalOpen(true)}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 inline mr-2" />
              Quick Purchase
            </button>
          </div>
        </div>
      ) : (
        /* Data Table */
        <DataTable
          columns={[
            { key: "name", label: "Product", type: "text" },
            { key: "category", label: "Category", type: "text" },
            { key: "stock", label: "Stock", type: "number" },
            { key: "costPrice", label: "Cost Price", type: "currency" },
            { key: "salePrice", label: "Sale Price", type: "currency" },
            { key: "profitMargin", label: "Margin", type: "text" },
            { key: "expiry", label: "Expiry Date", type: "date" },
          ]}
          data={filtered.map(p => ({
            ...p,
            profitMargin: p.costPrice > 0 
              ? (((p.salePrice - p.costPrice) / p.costPrice) * 100).toFixed(1) + "%"
              : "N/A"
          }))}
          selected={selected}
          setSelected={setSelected}
          onEdit={handleEdit}
          onView={handleView}
          onQuickSale={handleQuickSale}
          onQuickPurchase={handleQuickPurchase}
          showEdit={true}
          showRowMenu={true}
          rowMenuItems={[
            {
              label: "View Details",
              icon: <Eye size={14} />,
              onClick: handleView
            },
            {
              label: "Edit Product",
              icon: <Edit size={14} />,
              onClick: handleEdit
            },
            {
              label: "Quick Sale",
              icon: <TrendingUp size={14} />,
              onClick: handleQuickSale
            },
            {
              label: "Quick Purchase",
              icon: <ShoppingCart size={14} />,
              onClick: handleQuickPurchase
            },
            {
              label: "Delete",
              icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              ),
              onClick: (product) => {
                setSelected([product._id]);
                setTimeout(() => handleDelete(), 100);
              },
              variant: 'danger'
            }
          ]}
        />
      )}

      {/* Modals */}
      <AddEditModal
        open={addEditModalOpen}
        onClose={() => {
          setAddEditModalOpen(false);
          setEditProduct(null);
        }}
        onSubmit={handleModalSubmit}
        product={editProduct}
        isSubmitting={addProduct.isPending || updateProduct.isPending}
      />

      <ViewProductModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        product={viewProduct}
      />

      <AddSaleModal
        open={saleModalOpen}
        onClose={() => {
          setSaleModalOpen(false);
          setSelectedProductForSale(null);
        }}
        onSubmit={handleAddSale}
        onPrintInvoice={(saleId) => {
          const invoiceUrl = `/api/sales/invoice/${saleId}`;
          window.open(invoiceUrl, '_blank');
        }}
        preSelectedProducts={selectedProductForSale}
        isSubmitting={addSale.isPending}
      />

      <AddPurchaseModal
        open={purchaseModalOpen}
        onClose={() => {
          setPurchaseModalOpen(false);
          setSelectedProductForPurchase(null);
        }}
        onSubmit={handleAddPurchase}
        preSelectedProduct={selectedProductForPurchase}
        isSubmitting={addPurchase.isPending}
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
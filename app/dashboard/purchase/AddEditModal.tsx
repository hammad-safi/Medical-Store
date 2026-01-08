// "use client";
// import { useState, useEffect } from "react";
// import { X, Search, Plus, Trash2, Package, Building, Phone, DollarSign, Calendar, FileText, Percent, Check, ChevronDown, UserPlus, ShoppingCart } from "lucide-react";
// import api from "@/app/lib/axios";

// interface Supplier {
//   _id: string;
//   name: string;
//   phone: string;
//   email: string;
//   address: string;
// }

// interface Product {
//   _id: string;
//   name: string;
//   category: string;
//   stock: number;
//   costPrice: number;
//   salePrice: number;
//   expiry: string;
// }

// interface PurchaseItem {
//   productId: string;
//   productName: string;
//   quantity: number;
//   unitCost: number;
//   expiryDate: string;
//   batchNumber?: string;
//   totalCost: number;
// }

// interface PurchaseForm {
//   supplierId: string;
//   supplierName: string;
//   supplierContact: string;
//   items: PurchaseItem[];
//   tax: number;
//   shippingCost: number;
//   otherCharges: number;
//   paymentMethod: string;
//   paymentStatus: string;
//   expectedDelivery?: string;
//   notes: string;
//   status: string;
// }

// interface AddPurchaseModalProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (form: PurchaseForm) => Promise<any>;
//   preSelectedProduct?: Product | null;
//   preSelectedProducts?: Product[] | null;
// }

// const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'Credit', 'Cheque', 'Online'];
// const PAYMENT_STATUSES = ['Paid', 'Partial', 'Pending'];
// const PURCHASE_STATUSES = ['Received', 'Pending', 'Partial', 'Cancelled'];

// export function AddPurchaseModal({ open, onClose, onSubmit, preSelectedProduct, preSelectedProducts }: AddPurchaseModalProps) {
//   const [form, setForm] = useState<PurchaseForm>({
//     supplierId: "",
//     supplierName: "",
//     supplierContact: "",
//     items: [],
//     tax: 0,
//     shippingCost: 0,
//     otherCharges: 0,
//     paymentMethod: "Cash",
//     paymentStatus: "Paid",
//     expectedDelivery: "",
//     notes: "",
//     status: "Received",
//   });

//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [purchaseCreated, setPurchaseCreated] = useState<any>(null);
  
//   // Supplier selection
//   const [supplierSearch, setSupplierSearch] = useState("");
//   const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
//   const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
//   const [showNewSupplier, setShowNewSupplier] = useState(false);
//   const [newSupplier, setNewSupplier] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     address: ""
//   });

//   // Product selection
//   const [productSearch, setProductSearch] = useState("");
//   const [productSuggestions, setProductSuggestions] = useState<Product[]>([]);
//   const [showProductDropdown, setShowProductDropdown] = useState(false);
  
//   // New item form
//   const [newItem, setNewItem] = useState<Omit<PurchaseItem, 'totalCost'>>({
//     productId: "",
//     productName: "",
//     quantity: 1,
//     unitCost: 0,
//     expiryDate: "",
//     batchNumber: "",
//   });

//   // Multi-select for products
//   const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
//   const [showSelectedProducts, setShowSelectedProducts] = useState(false);

//   useEffect(() => {
//     if (open) {
//       fetchSuppliers();
//       fetchProducts();
      
//       // Handle pre-selected products
//       if (preSelectedProducts && preSelectedProducts.length > 0) {
//         setSelectedProducts(preSelectedProducts);
//         // Add all pre-selected products to items
//         const initialItems = preSelectedProducts.map(product => ({
//           productId: product._id,
//           productName: product.name,
//           quantity: 1,
//           unitCost: product.costPrice || 0,
//           expiryDate: product.expiry ? new Date(product.expiry).toISOString().split('T')[0] : "",
//           batchNumber: `BATCH-${Date.now().toString(36).slice(-6)}`,
//           totalCost: product.costPrice || 0
//         }));
//         setForm(prev => ({ ...prev, items: initialItems }));
//       } else if (preSelectedProduct) {
//         // Single pre-selected product
//         handleSelectProduct(preSelectedProduct);
//       }
//     } else {
//       resetForm();
//     }
//   }, [open, preSelectedProduct, preSelectedProducts]);

//   useEffect(() => {
//     if (productSearch) {
//       const filtered = products.filter(p =>
//         p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
//         p.category.toLowerCase().includes(productSearch.toLowerCase())
//       ).slice(0, 8);
//       setProductSuggestions(filtered);
//     } else {
//       setProductSuggestions([]);
//     }
//   }, [productSearch, products]);

//   useEffect(() => {
//     if (supplierSearch) {
//       const filtered = suppliers.filter(s =>
//         s.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
//         s.phone.includes(supplierSearch)
//       );
//       setFilteredSuppliers(filtered);
//     } else {
//       setFilteredSuppliers(suppliers);
//     }
//   }, [supplierSearch, suppliers]);

//   const fetchSuppliers = async () => {
//     try {
//       const res = await api.get("/suppliers");
//       setSuppliers(res.data.data || []);
//       setFilteredSuppliers(res.data.data || []);
//     } catch (error) {
//       console.error("Failed to fetch suppliers", error);
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const res = await api.get("/inventory");
//       setProducts(res.data.data || []);
//     } catch (error) {
//       console.error("Failed to fetch products", error);
//     }
//   };

//   const resetForm = () => {
//     setForm({
//       supplierId: "",
//       supplierName: "",
//       supplierContact: "",
//       items: [],
//       tax: 0,
//       shippingCost: 0,
//       otherCharges: 0,
//       paymentMethod: "Cash",
//       paymentStatus: "Paid",
//       expectedDelivery: "",
//       notes: "",
//       status: "Received",
//     });
//     setNewItem({
//       productId: "",
//       productName: "",
//       quantity: 1,
//       unitCost: 0,
//       expiryDate: "",
//       batchNumber: "",
//     });
//     setSelectedProducts([]);
//     setPurchaseCreated(null);
//     setProductSearch("");
//     setSupplierSearch("");
//     setShowSupplierDropdown(false);
//     setShowProductDropdown(false);
//     setShowNewSupplier(false);
//     setNewSupplier({
//       name: "",
//       phone: "",
//       email: "",
//       address: ""
//     });
//   };

//   // Supplier functions
//   const handleSelectSupplier = (supplier: Supplier) => {
//     setForm(prev => ({
//       ...prev,
//       supplierId: supplier._id,
//       supplierName: supplier.name,
//       supplierContact: supplier.phone
//     }));
//     setShowSupplierDropdown(false);
//     setSupplierSearch("");
//   };

//   const handleAddSupplier = async () => {
//     if (!newSupplier.name) {
//       alert("Supplier name is required");
//       return;
//     }

//     try {
//       const res = await api.post("/suppliers", newSupplier);
//       const createdSupplier = res.data.data;
      
//       setSuppliers(prev => [createdSupplier, ...prev]);
//       setFilteredSuppliers(prev => [createdSupplier, ...prev]);
      
//       handleSelectSupplier(createdSupplier);
//       setShowNewSupplier(false);
//       setNewSupplier({
//         name: "",
//         phone: "",
//         email: "",
//         address: ""
//       });
//     } catch (error) {
//       console.error("Failed to create supplier", error);
//       alert("Failed to create supplier. Please try again.");
//     }
//   };

//   // Product functions
//   const handleSelectProduct = (product: Product) => {
//     const existingItem = form.items.find(item => item.productId === product._id);
    
//     if (existingItem) {
//       // Update quantity if already exists
//       setForm(prev => ({
//         ...prev,
//         items: prev.items.map(item =>
//           item.productId === product._id
//             ? { ...item, quantity: item.quantity + 1, totalCost: (item.quantity + 1) * item.unitCost }
//             : item
//         )
//       }));
//     } else {
//       // Add new item
//       const newPurchaseItem = {
//         productId: product._id,
//         productName: product.name,
//         quantity: 1,
//         unitCost: product.costPrice || 0,
//         expiryDate: product.expiry ? new Date(product.expiry).toISOString().split('T')[0] : "",
//         batchNumber: `BATCH-${Date.now().toString(36).slice(-6)}`,
//         totalCost: product.costPrice || 0
//       };
      
//       setForm(prev => ({
//         ...prev,
//         items: [...prev.items, newPurchaseItem]
//       }));
      
//       // Add to selected products
//       if (!selectedProducts.find(p => p._id === product._id)) {
//         setSelectedProducts(prev => [...prev, product]);
//       }
//     }
    
//     setProductSearch("");
//     setShowProductDropdown(false);
//   };

//   const handleAddMultipleProducts = () => {
//     if (selectedProducts.length === 0) {
//       alert("Please select at least one product");
//       return;
//     }

//     const newItems = selectedProducts
//       .filter(product => !form.items.find(item => item.productId === product._id))
//       .map(product => ({
//         productId: product._id,
//         productName: product.name,
//         quantity: 1,
//         unitCost: product.costPrice || 0,
//         expiryDate: product.expiry ? new Date(product.expiry).toISOString().split('T')[0] : "",
//         batchNumber: `BATCH-${Date.now().toString(36).slice(-6)}`,
//         totalCost: product.costPrice || 0
//       }));

//     if (newItems.length > 0) {
//       setForm(prev => ({
//         ...prev,
//         items: [...prev.items, ...newItems]
//       }));
//       setSelectedProducts([]);
//       setProductSearch("");
//       setShowSelectedProducts(false);
//     }
//   };

//   const handleQuickAddProduct = () => {
//     if (!newItem.productName || newItem.quantity <= 0 || newItem.unitCost <= 0 || !newItem.expiryDate) {
//       alert("Please fill all required fields: product name, quantity, unit cost, and expiry date");
//       return;
//     }

//     const totalCost = newItem.quantity * newItem.unitCost;
//     const newPurchaseItem = { ...newItem, totalCost };
    
//     setForm(prev => ({
//       ...prev,
//       items: [...prev.items, newPurchaseItem]
//     }));

//     setNewItem({
//       productId: "",
//       productName: "",
//       quantity: 1,
//       unitCost: 0,
//       expiryDate: "",
//       batchNumber: "",
//     });
//     setProductSearch("");
//   };

//   const handleRemoveItem = (index: number) => {
//     const removedItem = form.items[index];
//     setForm(prev => ({
//       ...prev,
//       items: prev.items.filter((_, i) => i !== index)
//     }));
    
//     // Remove from selected products if no longer in items
//     const itemStillExists = form.items.filter((item, i) => i !== index).find(item => item.productId === removedItem.productId);
//     if (!itemStillExists) {
//       setSelectedProducts(prev => prev.filter(p => p._id !== removedItem.productId));
//     }
//   };

//   const handleUpdateItem = (index: number, field: keyof PurchaseItem, value: any) => {
//     setForm(prev => {
//       const updatedItems = [...prev.items];
//       updatedItems[index] = {
//         ...updatedItems[index],
//         [field]: value,
//       };
      
//       if (field === 'quantity' || field === 'unitCost') {
//         updatedItems[index].totalCost = updatedItems[index].quantity * updatedItems[index].unitCost;
//       }
      
//       return { ...prev, items: updatedItems };
//     });
//   };

//   const calculateTotals = () => {
//     const subtotal = form.items.reduce((sum, item) => sum + item.totalCost, 0);
//     const taxAmount = (subtotal * form.tax) / 100;
//     const grandTotal = subtotal + taxAmount + form.shippingCost + form.otherCharges;
//     const totalQuantity = form.items.reduce((sum, item) => sum + item.quantity, 0);

//     return { subtotal, taxAmount, grandTotal, totalQuantity };
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (form.items.length === 0) {
//       alert("Please add at least one product");
//       return;
//     }

//     if (!form.supplierName) {
//       alert("Please select a supplier");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const purchase = await onSubmit(form);
//       setPurchaseCreated(purchase);
//     } catch (error) {
//       console.error("Failed to create purchase", error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (!open) return null;

//   const totals = calculateTotals();

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
//       <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 relative my-4 max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6 pb-4 border-b">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900">
//               {purchaseCreated ? "Purchase Completed" : "Record Purchase"}
//             </h2>
//             <p className="text-sm text-gray-500 mt-1">
//               {purchaseCreated 
//                 ? "Purchase has been recorded successfully" 
//                 : "Add purchase details and products"
//               }
//             </p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <X size={20} className="text-gray-500" />
//           </button>
//         </div>

//         {purchaseCreated ? (
//           <div className="space-y-6 py-4">
//             {/* Success Card */}
//             <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Check className="w-8 h-8 text-green-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-green-800 mb-2">
//                 Purchase Recorded Successfully!
//               </h3>
//               <div className="inline-block bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
//                 Invoice #{purchaseCreated.invoiceNumber}
//               </div>
              
//               <div className="grid grid-cols-2 gap-4 mt-6">
//                 <div className="text-left">
//                   <p className="text-sm text-gray-600">Supplier</p>
//                   <p className="font-semibold">{purchaseCreated.supplierName}</p>
//                 </div>
//                 <div className="text-left">
//                   <p className="text-sm text-gray-600">Total Items</p>
//                   <p className="font-semibold">{purchaseCreated.totalQuantity}</p>
//                 </div>
//                 <div className="text-left">
//                   <p className="text-sm text-gray-600">Status</p>
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     purchaseCreated.status === 'Received' 
//                       ? 'bg-green-100 text-green-800'
//                       : purchaseCreated.status === 'Pending'
//                       ? 'bg-yellow-100 text-yellow-800'
//                       : 'bg-gray-100 text-gray-800'
//                   }`}>
//                     {purchaseCreated.status}
//                   </span>
//                 </div>
//                 <div className="text-left">
//                   <p className="text-sm text-gray-600">Total Amount</p>
//                   <p className="text-xl font-bold text-green-600">
//                     ${purchaseCreated.grandTotal?.toFixed(2)}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-3">
//               <button
//                 onClick={() => {
//                   resetForm();
//                   setPurchaseCreated(null);
//                 }}
//                 className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
//               >
//                 New Purchase
//               </button>
//               <button
//                 onClick={onClose}
//                 className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//               >
//                 Done
//               </button>
//             </div>
//           </div>
//         ) : (
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Supplier Section */}
//             <div className="space-y-4">
//               <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                 <Building className="w-5 h-5" />
//                 Supplier Information
//               </h3>
              
//               <div className="grid grid-cols-2 gap-4">
//                 {/* Supplier Selector */}
//                 <div className="col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Select Supplier *
//                   </label>
//                   <div className="relative">
//                     <div className="flex gap-2">
//                       <div className="flex-1 relative">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                         <input
//                           type="text"
//                           value={supplierSearch}
//                           onChange={(e) => {
//                             setSupplierSearch(e.target.value);
//                             setShowSupplierDropdown(true);
//                           }}
//                           onFocus={() => setShowSupplierDropdown(true)}
//                           className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                           placeholder="Search supplier..."
//                         />
//                         {form.supplierName && (
//                           <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                             <div className="flex justify-between items-center">
//                               <div>
//                                 <p className="font-medium text-gray-900">{form.supplierName}</p>
//                                 <p className="text-sm text-gray-600 mt-0.5">{form.supplierContact}</p>
//                               </div>
//                               <button
//                                 type="button"
//                                 onClick={() => {
//                                   setForm(prev => ({ ...prev, supplierId: "", supplierName: "", supplierContact: "" }));
//                                   setSupplierSearch("");
//                                 }}
//                                 className="text-gray-400 hover:text-red-500"
//                               >
//                                 <X size={16} />
//                               </button>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => setShowNewSupplier(true)}
//                         className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
//                       >
//                         <UserPlus size={16} />
//                         New
//                       </button>
//                     </div>

//                     {showSupplierDropdown && filteredSuppliers.length > 0 && (
//                       <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
//                         {filteredSuppliers.map((supplier) => (
//                           <div
//                             key={supplier._id}
//                             onClick={() => handleSelectSupplier(supplier)}
//                             className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
//                           >
//                             <div className="font-medium text-gray-900">{supplier.name}</div>
//                             <div className="text-sm text-gray-500 mt-0.5">
//                               {supplier.phone} • {supplier.email}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* New Supplier Form */}
//                 {showNewSupplier && (
//                   <div className="col-span-2 p-4 border border-gray-300 rounded-lg bg-gray-50 space-y-3">
//                     <div className="flex justify-between items-center">
//                       <h4 className="font-medium text-gray-900">New Supplier</h4>
//                       <button
//                         type="button"
//                         onClick={() => setShowNewSupplier(false)}
//                         className="text-gray-400 hover:text-gray-600"
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>
//                     <div className="grid grid-cols-2 gap-3">
//                       <input
//                         type="text"
//                         value={newSupplier.name}
//                         onChange={(e) => setNewSupplier(prev => ({ ...prev, name: e.target.value }))}
//                         className="col-span-2 px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
//                         placeholder="Supplier Name *"
//                       />
//                       <input
//                         type="tel"
//                         value={newSupplier.phone}
//                         onChange={(e) => setNewSupplier(prev => ({ ...prev, phone: e.target.value }))}
//                         className="px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
//                         placeholder="Phone"
//                       />
//                       <input
//                         type="email"
//                         value={newSupplier.email}
//                         onChange={(e) => setNewSupplier(prev => ({ ...prev, email: e.target.value }))}
//                         className="px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
//                         placeholder="Email"
//                       />
//                       <input
//                         type="text"
//                         value={newSupplier.address}
//                         onChange={(e) => setNewSupplier(prev => ({ ...prev, address: e.target.value }))}
//                         className="col-span-2 px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
//                         placeholder="Address"
//                       />
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         type="button"
//                         onClick={handleAddSupplier}
//                         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                       >
//                         Add Supplier
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => setShowNewSupplier(false)}
//                         className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Products Section */}
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <h3 className="font-semibold text-gray-900 flex items-center gap-2">
//                   <ShoppingCart className="w-5 h-5" />
//                   Products ({form.items.length} added)
//                 </h3>
//                 {selectedProducts.length > 0 && (
//                   <button
//                     type="button"
//                     onClick={handleAddMultipleProducts}
//                     className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
//                   >
//                     <Plus size={16} />
//                     Add {selectedProducts.length} Selected
//                   </button>
//                 )}
//               </div>

//               {/* Product Selection Area */}
//               <div className="bg-gray-50 rounded-xl p-4 space-y-4">
//                 {/* Product Search */}
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <input
//                     type="text"
//                     value={productSearch}
//                     onChange={(e) => {
//                       setProductSearch(e.target.value);
//                       setShowProductDropdown(true);
//                     }}
//                     onFocus={() => setShowProductDropdown(true)}
//                     className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     placeholder="Search products by name or category..."
//                   />
                  
//                   {showProductDropdown && productSuggestions.length > 0 && (
//                     <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
//                       {productSuggestions.map((product) => {
//                         const isSelected = form.items.find(item => item.productId === product._id);
//                         const isInSelectedList = selectedProducts.find(p => p._id === product._id);
                        
//                         return (
//                           <div
//                             key={product._id}
//                             onClick={() => handleSelectProduct(product)}
//                             className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 flex items-center justify-between ${
//                               isSelected ? 'bg-blue-50' : ''
//                             }`}
//                           >
//                             <div className="flex-1">
//                               <div className="font-medium text-gray-900">{product.name}</div>
//                               <div className="text-xs text-gray-500 mt-0.5">
//                                 Stock: {product.stock} • Cost: ${product.costPrice}
//                               </div>
//                             </div>
//                             <div className="flex items-center gap-2">
//                               <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
//                                 {product.category}
//                               </span>
//                               {(isSelected || isInSelectedList) && (
//                                 <Check className="w-4 h-4 text-green-600" />
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>

//                 {/* Quick Add Form */}
//                 <div className="border-t pt-4">
//                   <h4 className="font-medium text-gray-900 mb-3">Quick Add Product</h4>
//                   <div className="grid grid-cols-7 gap-2">
//                     <div className="col-span-3">
//                       <input
//                         type="text"
//                         value={newItem.productName}
//                         onChange={(e) => setNewItem(prev => ({ ...prev, productName: e.target.value }))}
//                         className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
//                         placeholder="Product Name *"
//                       />
//                     </div>
//                     <div>
//                       <input
//                         type="number"
//                         value={newItem.quantity}
//                         onChange={(e) => setNewItem(prev => ({ ...prev, quantity: Math.max(1, parseInt(e.target.value) || 1) }))}
//                         className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
//                         placeholder="Qty"
//                         min="1"
//                       />
//                     </div>
//                     <div className="relative">
//                       <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       <input
//                         type="number"
//                         value={newItem.unitCost}
//                         onChange={(e) => setNewItem(prev => ({ ...prev, unitCost: parseFloat(e.target.value) || 0 }))}
//                         className="w-full pl-7 pr-2 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
//                         placeholder="Cost"
//                         min="0"
//                         step="0.01"
//                       />
//                     </div>
//                     <div>
//                       <input
//                         type="date"
//                         value={newItem.expiryDate}
//                         onChange={(e) => setNewItem(prev => ({ ...prev, expiryDate: e.target.value }))}
//                         className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <button
//                         type="button"
//                         onClick={handleQuickAddProduct}
//                         className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-1"
//                       >
//                         <Plus size={14} />
//                         Add
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Products Table */}
//               {form.items.length > 0 && (
//                 <div className="border border-gray-200 rounded-lg overflow-hidden">
//                   <div className="bg-gray-50 px-4 py-3 grid grid-cols-12 gap-2 text-xs font-medium text-gray-600 uppercase tracking-wider">
//                     <div className="col-span-4">Product</div>
//                     <div className="col-span-2 text-center">Qty</div>
//                     <div className="col-span-2 text-center">Unit Cost</div>
//                     <div className="col-span-2 text-center">Expiry</div>
//                     <div className="col-span-1 text-center">Total</div>
//                     <div className="col-span-1"></div>
//                   </div>
//                   <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
//                     {form.items.map((item, index) => (
//                       <div key={index} className="px-4 py-3 grid grid-cols-12 gap-2 items-center hover:bg-gray-50">
//                         <div className="col-span-4">
//                           <div className="font-medium text-gray-900">{item.productName}</div>
//                           {item.batchNumber && (
//                             <div className="text-xs text-gray-500 mt-0.5">
//                               Batch: {item.batchNumber}
//                             </div>
//                           )}
//                         </div>
//                         <div className="col-span-2">
//                           <input
//                             type="number"
//                             value={item.quantity}
//                             onChange={(e) => handleUpdateItem(index, 'quantity', parseInt(e.target.value) || 1)}
//                             className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-center"
//                             min="1"
//                           />
//                         </div>
//                         <div className="col-span-2">
//                           <div className="relative">
//                             <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
//                             <input
//                               type="number"
//                               value={item.unitCost}
//                               onChange={(e) => handleUpdateItem(index, 'unitCost', parseFloat(e.target.value) || 0)}
//                               className="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-center"
//                               min="0"
//                               step="0.01"
//                             />
//                           </div>
//                         </div>
//                         <div className="col-span-2">
//                           <input
//                             type="date"
//                             value={item.expiryDate}
//                             onChange={(e) => handleUpdateItem(index, 'expiryDate', e.target.value)}
//                             className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-center"
//                           />
//                         </div>
//                         <div className="col-span-1 font-medium text-gray-900 text-center">
//                           ${item.totalCost.toFixed(2)}
//                         </div>
//                         <div className="col-span-1 flex justify-center">
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveItem(index)}
//                             className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Two Column Layout for Other Details */}
//             <div className="grid grid-cols-2 gap-6">
//               {/* Left Column - Financial Details */}
//               <div className="space-y-4">
//                 <h3 className="font-semibold text-gray-900">Financial Details</h3>
//                 <div className="space-y-3">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Tax Rate (%)
//                     </label>
//                     <div className="relative">
//                       <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       <input
//                         type="number"
//                         value={form.tax}
//                         onChange={(e) => setForm(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
//                         className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                         min="0"
//                         step="0.1"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Shipping Cost
//                     </label>
//                     <div className="relative">
//                       <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       <input
//                         type="number"
//                         value={form.shippingCost}
//                         onChange={(e) => setForm(prev => ({ ...prev, shippingCost: parseFloat(e.target.value) || 0 }))}
//                         className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                         min="0"
//                         step="0.01"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Other Charges
//                     </label>
//                     <div className="relative">
//                       <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       <input
//                         type="number"
//                         value={form.otherCharges}
//                         onChange={(e) => setForm(prev => ({ ...prev, otherCharges: parseFloat(e.target.value) || 0 }))}
//                         className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                         min="0"
//                         step="0.01"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Column - Payment & Delivery */}
//               <div className="space-y-4">
//                 <h3 className="font-semibold text-gray-900">Payment & Delivery</h3>
//                 <div className="space-y-3">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Payment Method
//                     </label>
//                     <select
//                       value={form.paymentMethod}
//                       onChange={(e) => setForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
//                       className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     >
//                       {PAYMENT_METHODS.map(method => (
//                         <option key={method} value={method}>{method}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Payment Status
//                     </label>
//                     <select
//                       value={form.paymentStatus}
//                       onChange={(e) => setForm(prev => ({ ...prev, paymentStatus: e.target.value }))}
//                       className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     >
//                       {PAYMENT_STATUSES.map(status => (
//                         <option key={status} value={status}>{status}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Purchase Status
//                     </label>
//                     <select
//                       value={form.status}
//                       onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
//                       className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                     >
//                       {PURCHASE_STATUSES.map(status => (
//                         <option key={status} value={status}>{status}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Expected Delivery
//                     </label>
//                     <div className="relative">
//                       <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       <input
//                         type="date"
//                         value={form.expectedDelivery}
//                         onChange={(e) => setForm(prev => ({ ...prev, expectedDelivery: e.target.value }))}
//                         className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                       />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Notes
//                     </label>
//                     <div className="relative">
//                       <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       <input
//                         type="text"
//                         value={form.notes}
//                         onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
//                         className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                         placeholder="Optional notes"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Summary Card */}
//             <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-200">
//               <h4 className="font-semibold text-gray-900 mb-4">Purchase Summary</h4>
//               <div className="grid grid-cols-4 gap-4">
//                 <div className="text-center p-3 bg-white rounded-lg border">
//                   <div className="text-2xl font-bold text-blue-600">{form.items.length}</div>
//                   <div className="text-sm text-gray-600 mt-1">Items</div>
//                 </div>
//                 <div className="text-center p-3 bg-white rounded-lg border">
//                   <div className="text-2xl font-bold text-green-600">{totals.totalQuantity}</div>
//                   <div className="text-sm text-gray-600 mt-1">Total Qty</div>
//                 </div>
//                 <div className="text-center p-3 bg-white rounded-lg border">
//                   <div className="text-2xl font-bold text-purple-600">${totals.subtotal.toFixed(2)}</div>
//                   <div className="text-sm text-gray-600 mt-1">Subtotal</div>
//                 </div>
//                 <div className="text-center p-3 bg-white rounded-lg border bg-gradient-to-r from-green-50 to-emerald-50">
//                   <div className="text-2xl font-bold text-green-600">${totals.grandTotal.toFixed(2)}</div>
//                   <div className="text-sm text-gray-600 mt-1">Grand Total</div>
//                 </div>
//               </div>
              
//               <div className="mt-4 pt-4 border-t space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Tax ({form.tax}%):</span>
//                   <span className="font-medium">+${totals.taxAmount.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Shipping:</span>
//                   <span className="font-medium">+${form.shippingCost.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Other Charges:</span>
//                   <span className="font-medium">+${form.otherCharges.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-3 pt-4">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="flex-1 py-3.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
//                 disabled={submitting}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={form.items.length === 0 || !form.supplierName || submitting}
//                 className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//               >
//                 {submitting ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
//                     Processing...
//                   </>
//                 ) : (
//                   "Complete Purchase"
//                 )}
//               </button>
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { X, Plus, Trash2, ChevronDown, Search, UserPlus, Package } from "lucide-react";
import api from "@/app/lib/axios";

interface Supplier {
  _id: string;
  name: string;
  phone?: string;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  stock: number;
  costPrice: number;
  salePrice: number;
  expiry: string;
}

interface PurchaseItem {
  productId?: string;
  productName: string;
  quantity: number;
  unitCost: number;
  expiryDate?: string;
  batchNumber?: string;
}

interface AddPurchaseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<any>;
  preSelectedProduct?: any | null;
}

const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'Credit', 'Cheque', 'Online'];
const PAYMENT_STATUSES = ['Paid', 'Partial', 'Pending'];

export function AddPurchaseModal({
  open,
  onClose,
  onSubmit,
  preSelectedProduct,
}: AddPurchaseModalProps) {
  /* ---------------- STATE ---------------- */
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);

  const [items, setItems] = useState<PurchaseItem[]>([
    { productName: "", quantity: 1, unitCost: 0, expiryDate: "" }
  ]);
  const [tax, setTax] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Product search state
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [productSuggestions, setProductSuggestions] = useState<Product[]>([]);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // New product quick add
  const [newProduct, setNewProduct] = useState<PurchaseItem>({
    productName: "",
    quantity: 1,
    unitCost: 0,
    expiryDate: ""
  });

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        // Fetch suppliers
        const suppliersRes = await api.get("/suppliers");
        setSuppliers(suppliersRes.data.data || []);
        
        // Fetch products from inventory
        const productsRes = await api.get("/inventory");
        setProducts(productsRes.data.data || []);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [open]);

  /* ---------------- PRESELECT PRODUCT ---------------- */
  useEffect(() => {
    if (preSelectedProduct && open) {
      setItems([
        {
          productId: preSelectedProduct._id,
          productName: preSelectedProduct.name,
          quantity: 1,
          unitCost: preSelectedProduct.costPrice || 0,
          expiryDate: preSelectedProduct.expiry || "",
        },
      ]);
    }
  }, [preSelectedProduct, open]);

  /* ---------------- PRODUCT SEARCH ---------------- */
  useEffect(() => {
    if (productSearch.trim()) {
      const searchTerm = productSearch.toLowerCase();
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        (p.category && p.category.toLowerCase().includes(searchTerm))
      ).slice(0, 8); // Limit to 8 suggestions
      setProductSuggestions(filtered);
    } else {
      setProductSuggestions([]);
    }
  }, [productSearch, products]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setNewProduct({
      productId: product._id,
      productName: product.name,
      quantity: 1,
      unitCost: product.costPrice || 0,
      expiryDate: product.expiry || "",
    });
    setProductSearch(product.name);
    setShowProductDropdown(false);
  };

  if (!open) return null;

  /* ---------------- CALCULATIONS ---------------- */
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitCost,
    0
  );
  const taxAmount = (subtotal * tax) / 100;
  const total = subtotal + taxAmount + shippingCost;

  /* ---------------- HELPERS ---------------- */
  const updateItem = (index: number, key: keyof PurchaseItem, value: any) => {
    const updated = [...items];
    (updated[index] as any)[key] = value;
    setItems(updated);
  };

  const addItemFromSearch = () => {
    if (selectedProduct) {
      // Check if product already exists in items
      const existingIndex = items.findIndex(item => 
        item.productId === selectedProduct._id || 
        item.productName === selectedProduct.name
      );
      
      if (existingIndex !== -1) {
        // Update quantity if exists
        const updated = [...items];
        updated[existingIndex].quantity += newProduct.quantity;
        setItems(updated);
      } else {
        // Add new item
        setItems([...items, { ...newProduct }]);
      }
      
      // Reset
      setSelectedProduct(null);
      setNewProduct({ productName: "", quantity: 1, unitCost: 0, expiryDate: "" });
      setProductSearch("");
    }
  };

  const addEmptyItem = () => {
    setItems([...items, { productName: "", quantity: 1, unitCost: 0, expiryDate: "" }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const addQuickProduct = () => {
    if (!newProduct.productName || newProduct.unitCost <= 0) {
      alert("Please enter product name and unit cost");
      return;
    }
    
    // Check if product already exists
    const existingIndex = items.findIndex(item => 
      item.productName === newProduct.productName
    );
    
    if (existingIndex !== -1) {
      // Update quantity if exists
      const updated = [...items];
      updated[existingIndex].quantity += newProduct.quantity;
      setItems(updated);
    } else {
      setItems([...items, { ...newProduct }]);
    }
    
    setNewProduct({ productName: "", quantity: 1, unitCost: 0, expiryDate: "" });
    setSelectedProduct(null);
    setProductSearch("");
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!selectedSupplier) {
      alert("Please select a supplier");
      return;
    }

    if (items.length === 0 || items.some(item => !item.productName || item.unitCost <= 0)) {
      alert("Please add valid products");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        supplierName: selectedSupplier.name,
        supplierContact: selectedSupplier.phone || "",
        items: items.map(item => ({
          ...item,
          batchNumber: item.batchNumber || `BATCH-${Date.now().toString(36).slice(-6)}`,
          expiryDate: item.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })),
        tax,
        shippingCost,
        paymentMethod,
        paymentStatus,
        notes,
        status: "Received",
      });
      onClose();
    } catch (error) {
      console.error("Failed to submit purchase", error);
      alert("Failed to save purchase");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- FILTER SUPPLIERS ---------------- */
  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(supplierSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* HEADER - Fixed */}
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">New Purchase</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* SUPPLIER */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier *
            </label>
            <div className="relative">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="Search supplier..."
                    value={supplierSearch}
                    onChange={(e) => {
                      setSupplierSearch(e.target.value);
                      setShowSupplierDropdown(true);
                    }}
                    onFocus={() => setShowSupplierDropdown(true)}
                  />
                </div>
                <button
                  onClick={() => {
                    const name = prompt("Enter new supplier name:");
                    if (name) {
                      setSelectedSupplier({ _id: "new", name, phone: "" });
                      setSupplierSearch(name);
                    }
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <UserPlus size={16} />
                </button>
              </div>

              {selectedSupplier && (
                <div className="mt-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{selectedSupplier.name}</span>
                    <button
                      onClick={() => {
                        setSelectedSupplier(null);
                        setSupplierSearch("");
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}

              {showSupplierDropdown && filteredSuppliers.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                  {filteredSuppliers.map((supplier) => (
                    <div
                      key={supplier._id}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setSupplierSearch(supplier.name);
                        setShowSupplierDropdown(false);
                      }}
                    >
                      <p className="font-medium">{supplier.name}</p>
                      {supplier.phone && (
                        <p className="text-xs text-gray-500">{supplier.phone}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* PRODUCT SEARCH */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Products from Inventory
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Search products by name or category..."
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setShowProductDropdown(true);
                }}
                onFocus={() => setShowProductDropdown(true)}
              />
              
              {showProductDropdown && productSuggestions.length > 0 && (
                <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                  {productSuggestions.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleSelectProduct(product)}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                    >
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 flex justify-between">
                        <span>{product.category || "General"}</span>
                        <span className="font-medium">Cost: ${product.costPrice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SELECTED PRODUCT FORM */}
          {selectedProduct && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="font-medium text-gray-900">{selectedProduct.name}</div>
                  <div className="text-xs text-gray-600">
                    Stock: {selectedProduct.stock} • Category: {selectedProduct.category || "General"}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setProductSearch("");
                    setNewProduct({ productName: "", quantity: 1, unitCost: 0, expiryDate: "" });
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Quantity</label>
                  <input
                    type="number"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({...newProduct, quantity: Math.max(1, parseInt(e.target.value) || 1)})}
                    min="1"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Unit Cost</label>
                  <input
                    type="number"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                    value={newProduct.unitCost}
                    onChange={(e) => setNewProduct({...newProduct, unitCost: parseFloat(e.target.value) || 0})}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Expiry Date</label>
                  <input
                    type="date"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                    value={newProduct.expiryDate || ""}
                    onChange={(e) => setNewProduct({...newProduct, expiryDate: e.target.value})}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={addItemFromSearch}
                    className="w-full px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-1"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MANUAL PRODUCT ADD */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Or Add Product Manually</h4>
            <div className="grid grid-cols-5 gap-2">
              <input
                className="col-span-2 px-2 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="Product Name"
                value={newProduct.productName}
                onChange={(e) => setNewProduct({...newProduct, productName: e.target.value})}
              />
              <input
                type="number"
                className="px-2 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="Qty"
                value={newProduct.quantity}
                onChange={(e) => setNewProduct({...newProduct, quantity: Math.max(1, parseInt(e.target.value) || 1)})}
                min="1"
              />
              <input
                type="number"
                className="px-2 py-1.5 border border-gray-300 rounded text-sm"
                placeholder="Unit Cost"
                value={newProduct.unitCost}
                onChange={(e) => setNewProduct({...newProduct, unitCost: parseFloat(e.target.value) || 0})}
                min="0"
                step="0.01"
              />
              <button
                onClick={addQuickProduct}
                className="px-2 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center justify-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* PRODUCTS LIST */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-sm">Products in Purchase ({items.length})</h3>
              <button
                onClick={addEmptyItem}
                className="text-blue-600 text-sm flex items-center gap-1"
              >
                <Plus size={14} /> Add Row
              </button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-2">
              {items.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No products added yet. Search or add products above.
                </div>
              ) : (
                items.map((item, index) => (
                  <div key={index} className="grid grid-cols-6 gap-2 items-center">
                    <input
                      className="col-span-2 px-2 py-1.5 border border-gray-300 rounded text-sm"
                      placeholder="Product Name"
                      value={item.productName}
                      onChange={(e) => updateItem(index, "productName", e.target.value)}
                    />
                    <input
                      type="number"
                      className="px-2 py-1.5 border border-gray-300 rounded text-sm"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                      min="1"
                    />
                    <input
                      type="number"
                      className="px-2 py-1.5 border border-gray-300 rounded text-sm"
                      value={item.unitCost}
                      onChange={(e) => updateItem(index, "unitCost", Number(e.target.value))}
                      min="0"
                      step="0.01"
                    />
                    <input
                      type="date"
                      className="px-2 py-1.5 border border-gray-300 rounded text-sm"
                      value={item.expiryDate || ""}
                      onChange={(e) => updateItem(index, "expiryDate", e.target.value)}
                    />
                    <button
                      onClick={() => removeItem(index)}
                      className="text-gray-400 hover:text-red-500 p-1"
                      disabled={items.length === 1}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* FINANCIAL DETAILS - 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tax Rate (%)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                value={tax}
                onChange={(e) => setTax(Number(e.target.value) || 0)}
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Shipping Cost
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                value={shippingCost}
                onChange={(e) => setShippingCost(Number(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* PAYMENT DETAILS - 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                {PAYMENT_METHODS.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Payment Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                {PAYMENT_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* NOTES */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes here..."
            />
          </div>

          {/* SUMMARY */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({items.length} items):</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax ({tax}%):</span>
                <span className="text-blue-600">+${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-blue-600">+${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t">
                <span>Grand Total:</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER - Fixed */}
        <div className="p-4 border-t sticky bottom-0 bg-white">
          <button
            onClick={handleSubmit}
            disabled={!selectedSupplier || items.length === 0 || submitting}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Processing...
              </>
            ) : (
              "Save Purchase"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
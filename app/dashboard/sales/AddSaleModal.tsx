// "use client";
// import { useState, useEffect, useRef, useCallback } from "react";
// import {
//   X,
//   Search,
//   User,
//   Printer,
//   Calculator,
//   Package,
//   Plus,
//   Trash2,
//   Phone,
//   Check,
//   Minus,
//   Percent,
//   DollarSign,
//   CreditCard,
//   Landmark,
//   AlertCircle,
//   Smartphone,
// } from "lucide-react";
// import api from "@/app/lib/axios";

// /* ================= TYPES ================= */
// interface Product {
//   _id: string;
//   name: string;
//   stock: number;
//   salePrice: number;
//   category?: string;
// }

// interface SaleItem {
//   inventoryId: string;
//   productName: string;
//   quantity: number;
//   unitPrice: number;
//   total: number;
// }

// interface SaleFormData {
//   items: SaleItem[];
//   discount: number;
//   tax: number;
//   paymentMethod: string;
//   customerName: string;
//   customerPhone: string;
//   printInvoice: boolean;
// }

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: SaleFormData) => Promise<any>;
//   preSelectedProducts?: Product[] | null;
// }

// const PAYMENT_METHODS = [
//   { name: "Cash", icon: DollarSign },
//   { name: "Card", icon: CreditCard },
//   { name: "UPI", icon: Smartphone },
//   { name: "Credit", icon: Landmark },
// ];

// /* ========================================================= */
// export function AddSaleModal({ open, onClose, onSubmit, preSelectedProducts }: Props) {
//   const receiptRef = useRef<HTMLDivElement>(null);
//   const searchInputRef = useRef<HTMLInputElement>(null);

//   const [products, setProducts] = useState<Product[]>([]);
//   const [suggestions, setSuggestions] = useState<Product[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

//   const [saleResponse, setSaleResponse] = useState<any>(null);
//   const [showInvoice, setShowInvoice] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   const [form, setForm] = useState<SaleFormData>({
//     items: [],
//     discount: 0,
//     tax: 0,
//     paymentMethod: "Cash",
//     customerName: "",
//     customerPhone: "",
//     printInvoice: true,
//   });

//   const [newItem, setNewItem] = useState({
//     inventoryId: "",
//     productName: "",
//     quantity: 1,
//     unitPrice: 0,
//   });

//   const [isModalActive, setIsModalActive] = useState(false);

//   /* ================= ENTER KEY FUNCTIONALITY ================= */
//   // Handle Enter key press to trigger Complete button
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       // Check if Enter key is pressed without modifier keys
//       if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
//         const activeElement = document.activeElement;
//         const tagName = activeElement?.tagName || '';
//         const type = (activeElement as HTMLInputElement)?.type || '';
        
//         // Check if user is typing in an input field or textarea (should not trigger submit)
//         const isTypingInInput = tagName === 'INPUT' && 
//           type !== 'submit' && 
//           type !== 'button' && 
//           type !== 'radio' && 
//           type !== 'checkbox';
//         const isTextarea = tagName === 'TEXTAREA';
//         const isSelect = tagName === 'SELECT';
        
//         // Only trigger submit if not typing and form can be submitted
//         if (!isTypingInInput && !isTextarea && !isSelect && 
//             form.items.length > 0 && !submitting && 
//             open && !showInvoice) {
//           e.preventDefault();
//           handleSubmit(e as any);
//         }
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [form.items, submitting, open, showInvoice]);

//   /* ================= EFFECTS ================= */
//   useEffect(() => {
//     if (open) {
//       setIsModalActive(true);
//       fetchProducts();
//       if (searchInputRef.current) {
//         searchInputRef.current.focus();
//       }
//     }
//   }, [open]);

//   useEffect(() => {
//     if (isModalActive && preSelectedProducts?.length) {
//       setForm((prev) => ({
//         ...prev,
//         items: preSelectedProducts.map((p) => ({
//           inventoryId: p._id,
//           productName: p.name,
//           quantity: 1,
//           unitPrice: p.salePrice,
//           total: p.salePrice,
//         })),
//       }));
//     }
//   }, [isModalActive, preSelectedProducts]);

//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setSuggestions([]);
//       return;
//     }
//     const filtered = products
//       .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
//       .slice(0, 6);
//     setSuggestions(filtered);
//   }, [searchTerm, products]);

//   /* ================= FUNCTIONS ================= */
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
//       items: [],
//       discount: 0,
//       tax: 0,
//       paymentMethod: "Cash",
//       customerName: "",
//       customerPhone: "",
//       printInvoice: false,
//     });
//     setNewItem({ inventoryId: "", productName: "", quantity: 1, unitPrice: 0 });
//     setSaleResponse(null);
//     setSearchTerm("");
//     setSelectedProduct(null);
//     setShowInvoice(false);
//     setIsModalActive(false);
//     setErrors({});
//   };

//   const handleSelectProduct = (product: Product) => {
//     setSelectedProduct(product);
//     setNewItem({
//       inventoryId: product._id,
//       productName: product.name,
//       quantity: 1,
//       unitPrice: product.salePrice,
//     });
//     setSearchTerm("");
//     setSuggestions([]);
//   };

//   const addItem = () => {
//     if (!newItem.inventoryId || newItem.quantity <= 0 || newItem.unitPrice <= 0) {
//       setErrors({ item: "Please select a product and enter valid quantity/price" });
//       return;
//     }

//     const product = products.find((p) => p._id === newItem.inventoryId);
//     if (!product) {
//       setErrors({ item: "Product not found" });
//       return;
//     }

//     const existingItem = form.items.find((item) => item.inventoryId === newItem.inventoryId);
//     const existingQty = existingItem ? existingItem.quantity : 0;
//     const totalQty = existingQty + newItem.quantity;

//     if (totalQty > product.stock) {
//       setErrors({
//         item: `Only ${product.stock} available (requested: ${totalQty})`,
//       });
//       return;
//     }

//     setForm((prev) => {
//       const existingIndex = prev.items.findIndex((i) => i.inventoryId === newItem.inventoryId);

//       if (existingIndex !== -1) {
//         const updatedItems = [...prev.items];
//         const existing = updatedItems[existingIndex];
//         const newQty = existing.quantity + newItem.quantity;
//         updatedItems[existingIndex] = {
//           ...existing,
//           quantity: newQty,
//           total: newQty * existing.unitPrice,
//         };
//         return { ...prev, items: updatedItems };
//       }

//       return {
//         ...prev,
//         items: [
//           ...prev.items,
//           {
//             ...newItem,
//             total: newItem.quantity * newItem.unitPrice,
//           },
//         ],
//       };
//     });

//     setNewItem({ inventoryId: "", productName: "", quantity: 1, unitPrice: 0 });
//     setSelectedProduct(null);
//     setErrors({});
//   };

//   const removeItem = (index: number) => {
//     setForm((prev) => ({
//       ...prev,
//       items: prev.items.filter((_, i) => i !== index),
//     }));
//   };

//   const updateItem = (index: number, field: keyof SaleItem, value: any) => {
//     setForm((prev) => {
//       const updatedItems = [...prev.items];
//       const item = { ...updatedItems[index] };

//       if (field === "quantity") {
//         const qty = Math.max(1, parseInt(value) || 1);
//         item.quantity = qty;
//         item.total = qty * item.unitPrice;
//       } else if (field === "unitPrice") {
//         const price = parseFloat(value) || 0;
//         item.unitPrice = price;
//         item.total = item.quantity * price;
//       } else {
//         item[field] = value;
//       }

//       updatedItems[index] = item;
//       return { ...prev, items: updatedItems };
//     });
//   };

//   /* ================= TOTALS ================= */
//   const subtotal = form.items.reduce((s, i) => s + i.total, 0);
//   const discountAmount = (subtotal * form.discount) / 100;
//   const taxAmount = ((subtotal - discountAmount) * form.tax) / 100;
//   const grandTotal = subtotal - discountAmount + taxAmount;

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!form.items.length) {
//       setErrors({ items: "Please add at least one product" });
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const res = await onSubmit(form);
//       setSaleResponse(res);
//       setShowInvoice(true);
//     } catch (error) {
//       console.error("Error submitting:", error);
//       setErrors({ submit: "Failed to record sale" });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ================= PRINT ================= */
//   const handlePrint = () => {
//     if (!receiptRef.current) return;

//     const printContent = receiptRef.current.innerHTML;
//     const printWindow = window.open("", "_blank");

//     if (!printWindow) return;

//     printWindow.document.write(`
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Invoice ${saleResponse?.invoiceNumber || "INV-XXXX"}</title>
//         <style>
//           @media print {
//             @page { margin: 10mm; size: auto; }
//             body { margin: 0; font-family: 'Courier New', monospace; font-size: 12px; }
//           }
//           body { font-family: 'Courier New', monospace; font-size: 12px; margin: 20px; }
//           .invoice { width: 80mm; margin: 0 auto; padding: 10px; }
//           .text-center { text-align: center; }
//           .font-bold { font-weight: bold; }
//           table { width: 100%; border-collapse: collapse; }
//           th, td { padding: 4px 0; border-bottom: 1px dashed #ccc; }
//           .text-right { text-align: right; }
//           .total-row { font-weight: bold; border-top: 2px solid #000; padding-top: 5px; }
//           .discount-row { color: #dc2626; }
//           .tax-row { color: #059669; }
//         </style>
//       </head>
//       <body>
//         ${printContent}
//       </body>
//       </html>
//     `);

//     printWindow.document.close();
//     printWindow.focus();

//     setTimeout(() => {
//       printWindow.print();
//       printWindow.close();
//     }, 500);
//   };

//   useEffect(() => {
//     if (showInvoice && form.printInvoice && saleResponse) {
//       const timer = setTimeout(() => {
//         handlePrint();
//       }, 800);
//       return () => clearTimeout(timer);
//     }
//   }, [showInvoice, form.printInvoice, saleResponse]);

//   if (!isModalActive && !showInvoice) return null;

//   /* ================= INVOICE VIEW ================= */
//   if (showInvoice && saleResponse) {
//     const saleData = saleResponse.data || saleResponse;
//     const items = saleData.items || saleData.invoiceDetails?.items || [];

//     const discountPercentage = saleData.discount || form.discount;
//     const discountAmt = saleData.discountAmount || discountAmount;
//     const taxPercentage = saleData.tax || form.tax;
//     const taxAmt = saleData.taxAmount || taxAmount;
//     const subTotal = saleData.subtotal || subtotal;
//     const grandTotalAmt = saleData.grandTotal || grandTotal;

//  return (
//   <div 
//     className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-auto"
//     onClick={() => { resetForm(); onClose(); }} // Close when clicking backdrop
//   >
//     <div 
//       className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col"
//       onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to backdrop
//     >
//       {/* Header - Fixed */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-2 rounded-t-xl flex-shrink-0">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Printer size={22} />
//             <h2 className="font-bold text-lg">Sale Invoice</h2>
//           </div>
//           <button onClick={() => { resetForm(); onClose(); }} className="text-white hover:text-gray-200">
//             <X size={24} />
//           </button>
//         </div>
//         <div className="text-sm mt-1 opacity-90">
//           Invoice #{saleData.invoiceNumber || "N/A"}
//         </div>
//       </div>

//       {/* Scrollable Content Area */}
//       <div className="flex-1 overflow-y-auto p-5">
//         <div ref={receiptRef} className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm shadow-inner">
//           {/* Store Header */}
//           <div className="text-center border-b border-dashed border-gray-400 pb-2 mb-1">
//             <div className="font-bold text-xl">MEDIMART PHARMACY</div>
//             <div className="text-xs text-gray-600 mt-1">123 Pharmacy Street, City</div>
//             <div className="text-xs text-gray-600">Phone: (123) 456-7890</div>
//             <div className="mt-2 font-semibold">INVOICE #{saleData.invoiceNumber || "N/A"}</div>
//             <div className="text-xs text-gray-600 mt-1">
//               {new Date(saleData.createdAt || Date.now()).toLocaleString()}
//             </div>
//           </div>

//           {/* Customer */}
//           <div className="mb-3">
//             <div className="font-semibold mb-1">Bill To:</div>
//             <div>{saleData.customerName || "Guest Customer"}</div>
//             {saleData.customerPhone && <div className="text-xs">Phone: {saleData.customerPhone}</div>}
//           </div>

//           {/* Items */}
//           <table className="w-full mb-4">
//             <thead>
//               <tr className="border-b-2 border-gray-400">
//                 <th className="text-left py-1">Item</th>
//                 <th className="text-right py-1">Qty</th>
//                 <th className="text-right py-1">Price</th>
//                 <th className="text-right py-1">Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((item: any, index: number) => (
//                 <tr key={index} className="border-b border-gray-200">
//                   <td className="py-1">{item.productName || item.product}</td>
//                   <td className="text-right py-1">{item.quantity}</td>
//                   <td className="text-right py-1">${(item.unitPrice || 0).toFixed(2)}</td>
//                   <td className="text-right py-1 font-medium">${(item.total || 0).toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Totals */}
//           <div className="border-t-2 border-gray-400 pt-3">
//             <div className="flex justify-between mb-1">
//               <span>Subtotal:</span>
//               <span>${subTotal.toFixed(2)}</span>
//             </div>
//             {discountPercentage > 0 && (
//               <div className="flex justify-between text-red-600 mb-1">
//                 <span>Discount ({discountPercentage}%)</span>
//                 <span>-${discountAmt.toFixed(2)}</span>
//               </div>
//             )}
//             {taxPercentage > 0 && (
//               <div className="flex justify-between text-green-600 mb-1">
//                 <span>Tax ({taxPercentage}%)</span>
//                 <span>+${taxAmt.toFixed(2)}</span>
//               </div>
//             )}
//             <div className="flex justify-between font-bold text-lg mt-3 pt-2 border-t border-gray-300">
//               <span>Total:</span>
//               <span className="text-green-700">${grandTotalAmt.toFixed(2)}</span>
//             </div>
//             <div className="mt-3 pt-2 border-t border-gray-300">
//               <div className="flex justify-between font-medium">
//                 <span>Payment:</span>
//                 <span>{saleData.paymentMethod || "Cash"}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Buttons - Fixed at bottom */}
//       <div className="p-5 pt-0 flex-shrink-0">
//         <div className="mt-5 flex gap-3">
//           <button
//             onClick={handlePrint}
//             className="flex-1 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
//           >
//             <Printer size={18} />
//             Print Invoice
//           </button>
//           <button
//             onClick={() => { resetForm(); onClose(); }}
//             className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// );

//   }

//   /* ================= SALE FORM VIEW ================= */
//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-auto">
//       <div className="bg-white rounded-xl shadow-2xl flex flex-col w-full max-w-2xl"
//         style={{
//           height: open ? '90%' : '0'
//         }}
//       >
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-5 rounded-t-xl z-10">
//           <div className="flex items-center justify-between ">
//             <div className="flex items-center gap-3">
//               <Calculator size={22} />
//               <h2 className="font-bold text-lg">New Sale</h2>
//             </div>
//             <div className="flex items-center gap-3">
//              <label className="flex items-center gap-2 cursor-pointer px-2 py-1">
//   <input
//     type="checkbox"
//     checked={true}
//     onChange={(e) =>
//       setForm((prev) => ({ ...prev, printInvoice: e.target.checked }))
//     }
//     className="h-5 w-5 text-white bg-white border-2 border-white rounded focus:ring-2 focus:ring-blue-200"
//   />
//   <span className="text-white select-none font-medium">Invoice</span>
// </label>

//               <button
//                 onClick={() => { resetForm(); onClose(); }}
//                 className="px-4 py-2 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 disabled={form.items.length === 0 || submitting}
//                 className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-md"
//               >
//                 {submitting ? (
//                   <>
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     {form.printInvoice}
//                     Complete
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className=" flex-1 overflow-y-auto">
//           <form onSubmit={handleSubmit} className="p-5 space-y-6">
//             {/* Combined Add Products & Customer */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Product Search */}
//               <div className="space-y-2">
//                 <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
//                   <Package size={16} />
//                   Add Products
//                 </h3>
//                 <div className="relative">
//                   <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
//                   <input
//                     ref={searchInputRef}
//                     type="text"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     placeholder="Search product name..."
//                     className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
//                   />
//                   {suggestions.length > 0 && (
//                     <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-40 overflow-y-auto">
//                       {suggestions.map((product) => (
//                         <div
//                           key={product._id}
//                           onClick={() => handleSelectProduct(product)}
//                           className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors flex justify-between items-center text-sm"
//                         >
//                           <div>
//                             <div className="font-medium">{product.name}</div>
//                             <div className="text-xs text-gray-500">
//                               {product.category && `${product.category} • `}
//                               Stock: {product.stock}
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <div className="font-medium text-green-600">${product.salePrice.toFixed(2)}</div>
//                             {product.stock < 5 && (
//                               <div className="text-xs text-orange-600">Low stock</div>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Customer Info */}
//               <div className="space-y-2">
//                 <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
//                   <User size={16} />
//                   Customer (Optional)
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                   <input
//                     type="text"
//                     placeholder="Customer Name"
//                     value={form.customerName}
//                     onChange={(e) => setForm((prev) => ({ ...prev, customerName: e.target.value }))}
//                     className="w-full px-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                   />
//                   <div className="relative">
//                     <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
//                     <input
//                       type="tel"
//                       placeholder="Phone Number"
//                       value={form.customerPhone}
//                       onChange={(e) => setForm((prev) => ({ ...prev, customerPhone: e.target.value }))}
//                       className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Selected Product Form */}
//             {selectedProduct && (
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1 font-medium">Quantity</label>
//                     <div className="flex items-center border rounded-lg overflow-hidden">
//                       <button
//                         type="button"
//                         onClick={() => setNewItem((prev) => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
//                         className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 transition-colors"
//                       >
//                         <Minus size={14} />
//                       </button>
//                       <input
//                         type="number"
//                         value={newItem.quantity}
//                         onChange={(e) => {
//                           const val = parseInt(e.target.value);
//                           if (!isNaN(val)) {
//                             setNewItem((prev) => ({
//                               ...prev,
//                               quantity: Math.min(selectedProduct.stock, Math.max(1, val)),
//                             }));
//                           }
//                         }}
//                         className="w-full px-2 py-1.5 text-center border-x border-gray-300 focus:outline-none text-sm"
//                         min="1"
//                         max={selectedProduct.stock}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setNewItem((prev) => ({
//                           ...prev,
//                           quantity: Math.min(selectedProduct.stock, prev.quantity + 1),
//                         }))}
//                         className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 transition-colors"
//                       >
//                         <Plus size={14} />
//                       </button>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-xs text-gray-600 mb-1 font-medium">Unit Price</label>
//                     <input
//                       type="number"
//                       value={newItem.unitPrice}
//                       onChange={(e) => setNewItem((prev) => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
//                       className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                       step="0.01"
//                       min="0"
//                     />
//                   </div>

//                   <div className="col-span-2 sm:col-span-2 flex items-end">
//                     <button
//                       type="button"
//                       onClick={addItem}
//                       className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
//                     >
//                       <Plus size={14} />
//                       Add Item
//                     </button>
//                   </div>
//                 </div>

//                 {errors.item && (
//                   <div className="mt-2 text-red-600 text-xs flex items-center gap-2">
//                     <AlertCircle size={14} />
//                     {errors.item}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Items List */}
//             <div className="h-20 overflow-scroll">
//               {form.items.length > 0 && (
//                 <div className="h-20 border border-gray-200 rounded-lg overflow-scroll">
//                   <div className="max-h-64 overflow-y-auto">
//                     <table className="w-full text-sm">
//                       <thead className="bg-gray-100 sticky top-0">
//                         <tr>
//                           <th className="p-3 text-left font-semibold">Product</th>
//                           <th className="p-3 text-right font-semibold">Qty</th>
//                           <th className="p-3 text-right font-semibold">Price</th>
//                           <th className="p-3 text-right font-semibold">Total</th>
//                           <th className="p-3"></th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {form.items.map((item, index) => (
//                           <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
//                             <td className="p-3 font-medium">{item.productName}</td>
//                             <td className="p-3 text-right">
//                               <input
//                                 type="number"
//                                 value={item.quantity}
//                                 onChange={(e) => updateItem(index, "quantity", e.target.value)}
//                                 className="w-16 px-2 py-1 border rounded text-center"
//                                 min="1"
//                               />
//                             </td>
//                             <td className="p-3 text-right">
//                               <input
//                                 type="number"
//                                 value={item.unitPrice}
//                                 onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
//                                 className="w-20 px-2 py-1 border rounded text-right"
//                                 step="0.01"
//                                 min="0"
//                               />
//                             </td>
//                             <td className="p-3 text-right font-semibold text-green-700">
//                               ${item.total.toFixed(2)}
//                             </td>
//                             <td className="p-3 text-center">
//                               <button
//                                 type="button"
//                                 onClick={() => removeItem(index)}
//                                 className="text-red-500 hover:text-red-700 transition-colors"
//                               >
//                                 <Trash2 size={18} />
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {errors.items && (
//               <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-2">
//                 <AlertCircle size={18} />
//                 {errors.items}
//               </div>
//             )}

//             {/* Combined Discount & Payment Method */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Discount & Tax */}
//               <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
//                 <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2 text-sm">
//                   <Percent size={16} />
//                   Adjustments
//                 </h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   <div>
//                     <label className="block text-xs text-gray-700 mb-1 font-medium">Discount (%)</label>
//                     <div className="relative">
//                       <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
//                       <input
//                         type="number"
//                         value={form.discount}
//                         onChange={(e) => setForm((prev) => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
//                         className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                         min="0"
//                         max="100"
//                         step="0.1"
//                       />
//                     </div>
//                     {form.discount > 0 && (
//                       <div className="mt-1 text-xs text-red-600">
//                         Saves: ${discountAmount.toFixed(2)}
//                       </div>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-xs text-gray-700 mb-1 font-medium">Tax (%)</label>
//                     <div className="relative">
//                       <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
//                       <input
//                         type="number"
//                         value={form.tax}
//                         onChange={(e) => setForm((prev) => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
//                         className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                         min="0"
//                         step="0.1"
//                       />
//                     </div>
//                     {form.tax > 0 && (
//                       <div className="mt-1 text-xs text-green-600">
//                         Adds: ${taxAmount.toFixed(2)}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Payment Method */}
//               <div className="space-y-2">
//                 <label className="block text-xs text-gray-700 font-medium">Payment Method</label>
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//                   {PAYMENT_METHODS.map(({ name, icon: Icon }) => (
//                     <button
//                       key={name}
//                       type="button"
//                       onClick={() => setForm((prev) => ({ ...prev, paymentMethod: name }))}
//                       className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-2 text-xs font-medium transition-all ${
//                         form.paymentMethod === name
//                           ? "bg-blue-600 text-white border-blue-600 shadow-md"
//                           : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//                       }`}
//                     >
//                       <Icon size={14} />
//                       {name}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Order Summary */}
//             <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
//               <h4 className="font-semibold text-gray-800 mb-3">Order Summary</h4>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span>Subtotal</span>
//                   <span>${subtotal.toFixed(2)}</span>
//                 </div>
//                 {form.discount > 0 && (
//                   <div className="flex justify-between text-red-600">
//                     <span>Discount ({form.discount}%)</span>
//                     <span>-${discountAmount.toFixed(2)}</span>
//                   </div>
//                 )}
//                 {form.tax > 0 && (
//                   <div className="flex justify-between text-green-600">
//                     <span>Tax ({form.tax}%)</span>
//                     <span>+${taxAmount.toFixed(2)}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-300 mt-2">
//                   <span>Total Amount</span>
//                   <span className="text-green-700">${grandTotal.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>

//             {errors.submit && (
//               <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-2">
//                 <AlertCircle size={18} />
//                 {errors.submit}
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useEffect, useRef } from "react";
import {
  X,
  Search,
  User,
  Printer,
  Calculator,
  Package,
  Plus,
  Trash2,
  Phone,
  Check,
  Minus,
  Percent,
  DollarSign,
  CreditCard,
  Landmark,
  AlertCircle,
  Smartphone,
} from "lucide-react";
import api from "@/app/lib/axios";

/* ================= TYPES ================= */
interface Product {
  _id: string;
  name: string;
  stock: number;
  salePrice: number;
  category?: string;
}

interface SaleItem {
  inventoryId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface SaleFormData {
  items: SaleItem[];
  discount: number;
  tax: number;
  paymentMethod: string;
  customerName: string;
  customerPhone: string;
  printInvoice: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SaleFormData) => Promise<any>;
  preSelectedProducts?: Product[] | null;
  onPrintInvoice?: (saleId: string) => void; // Added
  isSubmitting?: boolean; // Added
}

const PAYMENT_METHODS = [
  { name: "Cash", icon: DollarSign },
  { name: "Card", icon: CreditCard },
  { name: "UPI", icon: Smartphone },
  { name: "Credit", icon: Landmark },
];

/* ========================================================= */
export function AddSaleModal({ 
  open, 
  onClose, 
  onSubmit, 
  preSelectedProducts,
  onPrintInvoice,
  isSubmitting = false // Added with default value
}: Props) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [saleResponse, setSaleResponse] = useState<any>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [form, setForm] = useState<SaleFormData>({
    items: [],
    discount: 0,
    tax: 0,
    paymentMethod: "Cash",
    customerName: "",
    customerPhone: "",
    printInvoice: true,
  });

  const [newItem, setNewItem] = useState({
    inventoryId: "",
    productName: "",
    quantity: 1,
    unitPrice: 0,
  });

  const [isModalActive, setIsModalActive] = useState(false);

  /* ================= ENTER KEY FUNCTIONALITY ================= */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const activeElement = document.activeElement;
        const tagName = activeElement?.tagName || '';
        const type = (activeElement as HTMLInputElement)?.type || '';
        
        const isTypingInInput = tagName === 'INPUT' && 
          type !== 'submit' && 
          type !== 'button' && 
          type !== 'radio' && 
          type !== 'checkbox';
        const isTextarea = tagName === 'TEXTAREA';
        const isSelect = tagName === 'SELECT';
        
        if (!isTypingInInput && !isTextarea && !isSelect && 
            form.items.length > 0 && !submitting && 
            open && !showInvoice) {
          e.preventDefault();
          handleSubmit(e as any);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [form.items, submitting, open, showInvoice]);

  /* ================= EFFECTS ================= */
  useEffect(() => {
    if (open) {
      setIsModalActive(true);
      fetchProducts();
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    if (isModalActive && preSelectedProducts?.length) {
      setForm((prev) => ({
        ...prev,
        items: preSelectedProducts.map((p) => ({
          inventoryId: p._id,
          productName: p.name,
          quantity: 1,
          unitPrice: p.salePrice,
          total: p.salePrice,
        })),
      }));
    }
  }, [isModalActive, preSelectedProducts]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = products
      .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 6);
    setSuggestions(filtered);
  }, [searchTerm, products]);

  /* ================= FUNCTIONS ================= */
  const fetchProducts = async () => {
    try {
      const res = await api.get("/inventory");
      setProducts(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const resetForm = () => {
    setForm({
      items: [],
      discount: 0,
      tax: 0,
      paymentMethod: "Cash",
      customerName: "",
      customerPhone: "",
      printInvoice: true,
    });
    setNewItem({ inventoryId: "", productName: "", quantity: 1, unitPrice: 0 });
    setSaleResponse(null);
    setSearchTerm("");
    setSelectedProduct(null);
    setShowInvoice(false);
    setIsModalActive(false);
    setErrors({});
  };

  const handleSelectProduct = (product: Product) => {
    const existingItem = form.items.find((item) => item.inventoryId === product._id);
    const existingQty = existingItem ? existingItem.quantity : 0;
    const totalQty = existingQty + 1;

    if (totalQty > product.stock) {
      setErrors({
        item: `Only ${product.stock} available (requested: ${totalQty})`,
      });
      setSearchTerm("");
      setSuggestions([]);
      return;
    }

    setForm((prev) => {
      const existingIndex = prev.items.findIndex((i) => i.inventoryId === product._id);

      if (existingIndex !== -1) {
        const updatedItems = [...prev.items];
        const existing = updatedItems[existingIndex];
        const newQty = existing.quantity + 1;
        updatedItems[existingIndex] = {
          ...existing,
          quantity: newQty,
          total: newQty * existing.unitPrice,
        };
        return { ...prev, items: updatedItems };
      }

      const newItem = {
        inventoryId: product._id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.salePrice,
        total: product.salePrice,
      };

      return {
        ...prev,
        items: [...prev.items, newItem],
      };
    });

    setSearchTerm("");
    setSuggestions([]);
    setSelectedProduct(null);
    setErrors({});
    
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const addItem = () => {
    if (!newItem.inventoryId || newItem.quantity <= 0 || newItem.unitPrice <= 0) {
      setErrors({ item: "Please select a product and enter valid quantity/price" });
      return;
    }

    const product = products.find((p) => p._id === newItem.inventoryId);
    if (!product) {
      setErrors({ item: "Product not found" });
      return;
    }

    const existingItem = form.items.find((item) => item.inventoryId === newItem.inventoryId);
    const existingQty = existingItem ? existingItem.quantity : 0;
    const totalQty = existingQty + newItem.quantity;

    if (totalQty > product.stock) {
      setErrors({
        item: `Only ${product.stock} available (requested: ${totalQty})`,
      });
      return;
    }

    setForm((prev) => {
      const existingIndex = prev.items.findIndex((i) => i.inventoryId === newItem.inventoryId);

      if (existingIndex !== -1) {
        const updatedItems = [...prev.items];
        const existing = updatedItems[existingIndex];
        const newQty = existing.quantity + newItem.quantity;
        updatedItems[existingIndex] = {
          ...existing,
          quantity: newQty,
          total: newQty * existing.unitPrice,
        };
        return { ...prev, items: updatedItems };
      }

      return {
        ...prev,
        items: [
          ...prev.items,
          {
            ...newItem,
            total: newItem.quantity * newItem.unitPrice,
          },
        ],
      };
    });

    setNewItem({ inventoryId: "", productName: "", quantity: 1, unitPrice: 0 });
    setSelectedProduct(null);
    setErrors({});
  };

  const removeItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index: number, field: keyof SaleItem, value: any) => {
    setForm((prev) => {
      const updatedItems = [...prev.items];
      const item = { ...updatedItems[index] };

      if (field === "quantity") {
        const qty = Math.max(1, parseInt(value) || 1);
        item.quantity = qty;
        item.total = qty * item.unitPrice;
      } else if (field === "unitPrice") {
        const price = parseFloat(value) || 0;
        item.unitPrice = price;
        item.total = item.quantity * price;
      } else {
        (item as any)[field] = value;
      }

      updatedItems[index] = item;
      return { ...prev, items: updatedItems };
    });
  };

  /* ================= TOTALS ================= */
  const subtotal = form.items.reduce((s, i) => s + i.total, 0);
  const discountAmount = (subtotal * form.discount) / 100;
  const taxAmount = ((subtotal - discountAmount) * form.tax) / 100;
  const grandTotal = subtotal - discountAmount + taxAmount;

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.items.length) {
      setErrors({ items: "Please add at least one product" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await onSubmit(form);
      setSaleResponse(res);
      setShowInvoice(true);
      
      // Call onPrintInvoice callback if provided
      if (onPrintInvoice && res?.data?._id) {
        onPrintInvoice(res.data._id);
      }
    } catch (error) {
      console.error("Error submitting:", error);
      setErrors({ submit: "Failed to record sale" });
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= PRINT ================= */
  const handlePrint = () => {
    if (!receiptRef.current) return;

    const printContent = receiptRef.current.innerHTML;
    const printWindow = window.open("", "_blank");

    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${saleResponse?.invoiceNumber || "INV-XXXX"}</title>
        <style>
          @media print {
            @page { margin: 10mm; size: auto; }
            body { margin: 0; font-family: 'Courier New', monospace; font-size: 12px; }
          }
          body { font-family: 'Courier New', monospace; font-size: 12px; margin: 20px; }
          .invoice { width: 80mm; margin: 0 auto; padding: 10px; }
          .text-center { text-align: center; }
          .font-bold { font-weight: bold; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 4px 0; border-bottom: 1px dashed #ccc; }
          .text-right { text-align: right; }
          .total-row { font-weight: bold; border-top: 2px solid #000; padding-top: 5px; }
          .discount-row { color: #dc2626; }
          .tax-row { color: #059669; }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  useEffect(() => {
    if (showInvoice && form.printInvoice && saleResponse) {
      const timer = setTimeout(() => {
        handlePrint();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showInvoice, form.printInvoice, saleResponse]);

  if (!isModalActive && !showInvoice) return null;

  /* ================= INVOICE VIEW ================= */
  if (showInvoice && saleResponse) {
    const saleData = saleResponse.data || saleResponse;
    const items = saleData.items || saleData.invoiceDetails?.items || [];

    const discountPercentage = saleData.discount || form.discount;
    const discountAmt = saleData.discountAmount || discountAmount;
    const taxPercentage = saleData.tax || form.tax;
    const taxAmt = saleData.taxAmount || taxAmount;
    const subTotal = saleData.subtotal || subtotal;
    const grandTotalAmt = saleData.grandTotal || grandTotal;

    return (
      <div 
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-auto"
        onClick={() => { resetForm(); onClose(); }}
      >
        <div 
          className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - Fixed */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-2 rounded-t-xl flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Printer size={22} />
                <h2 className="font-bold text-lg">Sale Invoice</h2>
              </div>
              <button onClick={() => { resetForm(); onClose(); }} className="text-white hover:text-gray-200">
                <X size={24} />
              </button>
            </div>
            <div className="text-sm mt-1 opacity-90">
              Invoice #{saleData.invoiceNumber || "N/A"}
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-5">
            <div ref={receiptRef} className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm shadow-inner">
              {/* Store Header */}
              <div className="text-center border-b border-dashed border-gray-400 pb-2 mb-1">
                <div className="font-bold text-xl">MEDIMART PHARMACY</div>
                <div className="text-xs text-gray-600 mt-1">123 Pharmacy Street, City</div>
                <div className="text-xs text-gray-600">Phone: (123) 456-7890</div>
                <div className="mt-2 font-semibold">INVOICE #{saleData.invoiceNumber || "N/A"}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {new Date(saleData.createdAt || Date.now()).toLocaleString()}
                </div>
              </div>

              {/* Customer */}
              <div className="mb-3">
                <div className="font-semibold mb-1">Bill To:</div>
                <div>{saleData.customerName || "Guest Customer"}</div>
                {saleData.customerPhone && <div className="text-xs">Phone: {saleData.customerPhone}</div>}
              </div>

              {/* Items */}
              <table className="w-full mb-4">
                <thead>
                  <tr className="border-b-2 border-gray-400">
                    <th className="text-left py-1">Item</th>
                    <th className="text-right py-1">Qty</th>
                    <th className="text-right py-1">Price</th>
                    <th className="text-right py-1">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any, index: number) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-1">{item.productName || item.product}</td>
                      <td className="text-right py-1">{item.quantity}</td>
                      <td className="text-right py-1">${(item.unitPrice || 0).toFixed(2)}</td>
                      <td className="text-right py-1 font-medium">${(item.total || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="border-t-2 border-gray-400 pt-3">
                <div className="flex justify-between mb-1">
                  <span>Subtotal:</span>
                  <span>${subTotal.toFixed(2)}</span>
                </div>
                {discountPercentage > 0 && (
                  <div className="flex justify-between text-red-600 mb-1">
                    <span>Discount ({discountPercentage}%)</span>
                    <span>-${discountAmt.toFixed(2)}</span>
                  </div>
                )}
                {taxPercentage > 0 && (
                  <div className="flex justify-between text-green-600 mb-1">
                    <span>Tax ({taxPercentage}%)</span>
                    <span>+${taxAmt.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg mt-3 pt-2 border-t border-gray-300">
                  <span>Total:</span>
                  <span className="text-green-700">${grandTotalAmt.toFixed(2)}</span>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-300">
                  <div className="flex justify-between font-medium">
                    <span>Payment:</span>
                    <span>{saleData.paymentMethod || "Cash"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons - Fixed at bottom */}
          <div className="p-5 pt-0 flex-shrink-0">
            <div className="mt-5 flex gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Printer size={18} />
                Print Invoice
              </button>
              <button
                onClick={() => { resetForm(); onClose(); }}
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= SALE FORM VIEW ================= */
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col w-full max-w-2xl"
        style={{
          height: open ? '90%' : '0'
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-5 rounded-t-xl z-10">
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-3">
              <Calculator size={22} />
              <h2 className="font-bold text-lg">New Sale</h2>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer px-2 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <input
                  type="checkbox"
                  checked={form.printInvoice}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, printInvoice: e.target.checked }))
                  }
                  className="h-5 w-5 text-blue-600 bg-white border-2 border-white rounded focus:ring-2 focus:ring-blue-200 cursor-pointer"
                />
                <span className="text-white select-none font-medium flex items-center gap-1">
                  <Printer size={16} />
                  Invoice
                </span>
              </label>

              <button
                onClick={() => { resetForm(); onClose(); }}
                className="px-4 py-2 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={form.items.length === 0 || submitting || isSubmitting}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                {(submitting || isSubmitting) ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Complete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-5 space-y-6">
            {/* Combined Add Products & Customer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Search */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                  <Package size={16} />
                  Add Products
                </h3>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search product name..."
                    className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                    disabled={submitting || isSubmitting}
                  />
                  {suggestions.length > 0 && !submitting && !isSubmitting && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-40 overflow-y-auto">
                      {suggestions.map((product) => (
                        <div
                          key={product._id}
                          onClick={() => handleSelectProduct(product)}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0 transition-colors flex justify-between items-center text-sm"
                        >
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-gray-500">
                              {product.category && `${product.category} • `}
                              Stock: {product.stock}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-green-600">${product.salePrice.toFixed(2)}</div>
                            {product.stock < 5 && (
                              <div className="text-xs text-orange-600">Low stock</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                  <User size={16} />
                  Customer (Optional)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={form.customerName}
                    onChange={(e) => setForm((prev) => ({ ...prev, customerName: e.target.value }))}
                    className="w-full px-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                    disabled={submitting || isSubmitting}
                  />
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={form.customerPhone}
                      onChange={(e) => setForm((prev) => ({ ...prev, customerPhone: e.target.value }))}
                      className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
                      disabled={submitting || isSubmitting}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Product Form */}
            {selectedProduct && !submitting && !isSubmitting && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">Quantity</label>
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setNewItem((prev) => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                        className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 transition-colors"
                        disabled={submitting || isSubmitting}
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val)) {
                            setNewItem((prev) => ({
                              ...prev,
                              quantity: Math.min(selectedProduct.stock, Math.max(1, val)),
                            }));
                          }
                        }}
                        className="w-full px-2 py-1.5 text-center border-x border-gray-300 focus:outline-none text-sm disabled:bg-gray-50"
                        min="1"
                        max={selectedProduct.stock}
                        disabled={submitting || isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setNewItem((prev) => ({
                          ...prev,
                          quantity: Math.min(selectedProduct.stock, prev.quantity + 1),
                        }))}
                        className="px-2 py-1.5 bg-gray-100 hover:bg-gray-200 transition-colors"
                        disabled={submitting || isSubmitting}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-medium">Unit Price</label>
                    <input
                      type="number"
                      value={newItem.unitPrice}
                      onChange={(e) => setNewItem((prev) => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-50"
                      step="0.01"
                      min="0"
                      disabled={submitting || isSubmitting}
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-2 flex items-end">
                    <button
                      type="button"
                      onClick={addItem}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={submitting || isSubmitting}
                    >
                      <Plus size={14} />
                      Add Item
                    </button>
                  </div>
                </div>

                {errors.item && (
                  <div className="mt-2 text-red-600 text-xs flex items-center gap-2">
                    <AlertCircle size={14} />
                    {errors.item}
                  </div>
                )}
              </div>
            )}

            {/* Items List */}
            <div className="min-h-[180px]">
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className={`${form.items.length > 0 ? 'max-h-[180px]' : 'max-h-[60px]'} overflow-y-auto`}>
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        <th className="p-3 text-left font-semibold">Product</th>
                        <th className="p-3 text-right font-semibold">Qty</th>
                        <th className="p-3 text-right font-semibold">Price</th>
                        <th className="p-3 text-right font-semibold">Total</th>
                        <th className="p-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.items.length > 0 ? (
                        form.items.map((item, index) => (
                          <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
                            <td className="p-3 font-medium">{item.productName}</td>
                            <td className="p-3 text-right">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItem(index, "quantity", e.target.value)}
                                className="w-16 px-2 py-1 border rounded text-center text-sm disabled:bg-gray-50"
                                min="1"
                                disabled={submitting || isSubmitting}
                              />
                            </td>
                            <td className="p-3 text-right">
                              <input
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                                className="w-20 px-2 py-1 border rounded text-right text-sm disabled:bg-gray-50"
                                step="0.01"
                                min="0"
                                disabled={submitting || isSubmitting}
                              />
                            </td>
                            <td className="p-3 text-right font-semibold text-green-700">
                              ${item.total.toFixed(2)}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={submitting || isSubmitting}
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-gray-500 italic">
                            No items added yet. Search and select products above.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {errors.items && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={18} />
                {errors.items}
              </div>
            )}

            {/* Combined Discount & Payment Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Discount & Tax */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2 text-sm">
                  <Percent size={16} />
                  Adjustments
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-700 mb-1 font-medium">Discount (%)</label>
                    <div className="relative">
                      <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="number"
                        value={form.discount || ""}
                        onChange={(e) => setForm((prev) => ({ 
                          ...prev, 
                          discount: e.target.value === "" ? 0 : parseFloat(e.target.value) || 0 
                        }))}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-50"
                        min="0"
                        max="100"
                        step="0.1"
                        disabled={submitting || isSubmitting}
                      />
                    </div>
                    {form.discount > 0 && (
                      <div className="mt-1 text-xs text-red-600">
                        Saves: ${discountAmount.toFixed(2)}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-700 mb-1 font-medium">Tax (%)</label>
                    <div className="relative">
                      <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="number"
                        value={form.tax || ""}
                        onChange={(e) => setForm((prev) => ({ 
                          ...prev, 
                          tax: e.target.value === "" ? 0 : parseFloat(e.target.value) || 0 
                        }))}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-50"
                        min="0"
                        step="0.1"
                        disabled={submitting || isSubmitting}
                      />
                    </div>
                    {form.tax > 0 && (
                      <div className="mt-1 text-xs text-green-600">
                        Adds: ${taxAmount.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="block text-xs text-gray-700 font-medium">Payment Method</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PAYMENT_METHODS.map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, paymentMethod: name }))}
                      className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-2 text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        form.paymentMethod === name
                          ? "bg-blue-600 text-white border-blue-600 shadow-md"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                      disabled={submitting || isSubmitting}
                    >
                      <Icon size={14} />
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
              <h4 className="font-semibold text-gray-800 mb-3">Order Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {form.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount ({form.discount}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {form.tax > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Tax ({form.tax}%)</span>
                    <span>+${taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-300 mt-2">
                  <span>Total Amount</span>
                  <span className="text-green-700">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={18} />
                {errors.submit}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
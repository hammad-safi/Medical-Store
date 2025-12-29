"use client";
import { X, Package, Building, Calendar, FileText, DollarSign, CheckCircle, Clock, AlertCircle, User, Truck, Receipt } from "lucide-react";

interface PurchaseItem {
  productName: string;
  quantity: number;
  unitCost: number;
  totalCost?: number;
  expiryDate?: string;
  batchNumber?: string;
}

interface Purchase {
  _id: string;
  invoiceNumber?: string;
  supplierName?: string;
  supplierContact?: string;
  supplierId?: {
    name: string;
  };
  items?: PurchaseItem[];
  subtotal?: number;
  tax?: number;
  taxAmount?: number;
  shippingCost?: number;
  otherCharges?: number;
  grandTotal?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  purchaseDate?: string;
  createdAt?: string;
  expectedDelivery?: string;
  notes?: string;
  status?: string;
  receivedBy?: {
    fullName?: string;
    email?: string;
  };
}

interface ViewPurchaseModalProps {
  open: boolean;
  onClose: () => void;
  data: Purchase | null;
}

export default function ViewPurchaseModal({ open, onClose, data }: ViewPurchaseModalProps) {
  if (!open || !data) return null;

  const safeNumber = (value: any, defaultValue: number = 0): number => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  const safeString = (value: any, defaultValue: string = 'N/A'): string => {
    if (value === null || value === undefined || value === '') return defaultValue;
    return String(value);
  };

  const safeDate = (dateValue: any): string => {
    if (!dateValue) return 'N/A';
    try {
      return new Date(dateValue).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'Received':
        return <CheckCircle className="w-3.5 h-3.5" />;
      case 'Pending':
        return <Clock className="w-3.5 h-3.5" />;
      case 'Partial':
        return <AlertCircle className="w-3.5 h-3.5" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Received': return 'bg-green-50 text-green-700 border-green-200';
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Partial': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-50 text-green-700 border-green-200';
      case 'Partial': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  const safeData = {
    invoiceNumber: safeString(data.invoiceNumber),
    supplierName: safeString(data.supplierName || data.supplierId?.name),
    supplierContact: safeString(data.supplierContact),
    items: Array.isArray(data.items) ? data.items : [],
    subtotal: safeNumber(data.subtotal),
    tax: safeNumber(data.tax),
    taxAmount: safeNumber(data.taxAmount),
    shippingCost: safeNumber(data.shippingCost),
    otherCharges: safeNumber(data.otherCharges),
    grandTotal: safeNumber(data.grandTotal),
    paymentMethod: safeString(data.paymentMethod),
    paymentStatus: safeString(data.paymentStatus),
    purchaseDate: safeDate(data.purchaseDate || data.createdAt),
    expectedDelivery: safeDate(data.expectedDelivery),
    notes: data.notes,
    status: safeString(data.status),
    receivedBy: data.receivedBy || { fullName: 'N/A', email: 'N/A' }
  };

  const totalQuantity = safeData.items.reduce((sum, item) => sum + safeNumber(item.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-xl w-full max-w-lg lg:max-w-2xl xl:max-w-3xl max-h-[90vh] sm:max-h-[95vh] flex flex-col shadow-xl">
        {/* Header - Compact */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900 truncate max-w-[150px] sm:max-w-none">
                Purchase #{safeData.invoiceNumber}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                {safeData.supplierName} • {safeData.purchaseDate}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={16} className="sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {/* Status Summary - Compact */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(safeData.status)}`}>
                {getStatusIcon(safeData.status)}
                {safeData.status}
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getPaymentStatusColor(safeData.paymentStatus)}`}>
                <DollarSign className="w-3 h-3" />
                {safeData.paymentStatus}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                <Building className="w-3 h-3" />
                {safeData.supplierName.length > 15 ? safeData.supplierName.substring(0, 15) + '...' : safeData.supplierName}
              </span>
            </div>
          </div>

          {/* Products Section - Scrollable */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-blue-600" />
                Products ({safeData.items.length})
              </h3>
              <span className="text-xs text-gray-600 font-medium">{totalQuantity} units</span>
            </div>
            
            {/* Products List - Mobile Cards, Desktop Table */}
            <div className="max-h-48 sm:max-h-56 overflow-y-auto border rounded-lg">
              {safeData.items.length > 0 ? (
                <>
                  {/* Mobile View - Cards */}
                  <div className="sm:hidden">
                    {safeData.items.map((item, index) => {
                      const itemQuantity = safeNumber(item.quantity);
                      const itemUnitCost = safeNumber(item.unitCost);
                      const itemTotalCost = safeNumber(item.totalCost, itemQuantity * itemUnitCost);
                      
                      return (
                        <div key={index} className="border-b last:border-b-0 p-3 bg-white hover:bg-gray-50">
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm truncate">
                                {item.productName || 'N/A'}
                              </h4>
                              {item.batchNumber && (
                                <p className="text-xs text-gray-500">Batch: {item.batchNumber}</p>
                              )}
                            </div>
                            <span className="font-semibold text-gray-900 text-sm">
                              ${itemTotalCost.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Qty: <span className="font-medium">{itemQuantity}</span></span>
                            <span>Unit: <span className="font-medium">${itemUnitCost.toFixed(2)}</span></span>
                            <span>Expiry: <span className="font-medium">
                              {item.expiryDate ? safeDate(item.expiryDate) : 'N/A'}
                            </span></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop View - Compact Table */}
                  <div className="hidden sm:block">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Product</th>
                          <th className="px-3 py-2 text-center text-xs font-medium text-gray-600">Qty</th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Unit</th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-600">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {safeData.items.map((item, index) => {
                          const itemQuantity = safeNumber(item.quantity);
                          const itemUnitCost = safeNumber(item.unitCost);
                          const itemTotalCost = safeNumber(item.totalCost, itemQuantity * itemUnitCost);
                          
                          return (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-3 py-2">
                                <div className="font-medium text-gray-900 truncate max-w-[120px]">
                                  {item.productName || 'N/A'}
                                </div>
                                {item.batchNumber && (
                                  <div className="text-xs text-gray-500">Batch: {item.batchNumber}</div>
                                )}
                              </td>
                              <td className="px-3 py-2 text-center font-medium">{itemQuantity}</td>
                              <td className="px-3 py-2 text-right">${itemUnitCost.toFixed(2)}</td>
                              <td className="px-3 py-2 text-right font-semibold text-gray-900">
                                ${itemTotalCost.toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No products found</p>
                </div>
              )}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100 mb-3">
            <h3 className="font-semibold text-gray-900 mb-2.5 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <span className="text-sm">Amount Summary</span>
            </h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${safeData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax ({safeData.tax.toFixed(1)}%)</span>
                <span className="text-blue-600">${safeData.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-blue-600">${safeData.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Charges</span>
                <span className="text-blue-600">${safeData.otherCharges.toFixed(2)}</span>
              </div>
              <div className="border-t border-blue-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-lg sm:text-xl font-bold text-green-600">${safeData.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info - Grid on larger screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Notes */}
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
              <h3 className="font-semibold text-gray-900 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-sm">Notes</span>
              </h3>
              <div className="text-xs sm:text-sm text-gray-700 min-h-[40px]">
                {safeData.notes ? (
                  <p className="line-clamp-3">{safeData.notes}</p>
                ) : (
                  <p className="text-gray-400 italic">No notes</p>
                )}
              </div>
            </div>
            
            {/* Received By */}
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-green-600" />
                <span className="text-sm">Received By</span>
              </h3>
              <p className="font-medium text-gray-900 text-sm truncate">
                {safeData.receivedBy.fullName || 'N/A'}
              </p>
              <p className="text-xs text-gray-600 mt-0.5 truncate">
                {safeData.receivedBy.email || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm sm:text-base transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
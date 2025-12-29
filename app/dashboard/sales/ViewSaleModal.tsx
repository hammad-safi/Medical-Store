"use client";

import {
  X,
  Printer,
  FileText,
  User,
  Package,
  CreditCard,
  Calendar,
  DollarSign,
  Phone,
} from "lucide-react";

/* ===================== TYPES ===================== */
interface Sale {
  _id: string;
  invoiceNumber?: string;
  productName?: string;
  customerName?: string;
  customerPhone?: string;
  quantity?: number;
  unitPrice?: number | string;
  totalAmount?: number | string;
  discount?: number | string;
  tax?: number | string;
  grandTotal?: number | string;
  paymentMethod?: string;
  createdAt?: string;
  sellerId?: {
    fullName?: string;
    email?: string;
  };
}

interface ViewSaleModalProps {
  open: boolean;
  onClose: () => void;
  sale: Sale | null;
  onPrintInvoice?: (saleId: string) => void;
}

/* ===================== COMPONENT ===================== */
export function ViewSaleModal({
  open,
  onClose,
  sale,
  onPrintInvoice,
}: ViewSaleModalProps) {
  if (!open || !sale) return null;

  /* ===== SAFE NUMBER NORMALIZATION ===== */
  const unitPrice = Number(sale.unitPrice ?? 0);
  const totalAmount = Number(sale.totalAmount ?? 0);
  const discount = Number(sale.discount ?? 0);
  const tax = Number(sale.tax ?? 0);
  const grandTotal = Number(sale.grandTotal ?? 0);

  const discountAmount = (totalAmount * discount) / 100;
  const taxAmount = ((totalAmount - discountAmount) * tax) / 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Sale Details
            </h2>
            <div className="mt-1 flex items-center gap-2 text-blue-600">
              <FileText size={16} />
              <span className="font-mono text-sm font-semibold">
                {sale.invoiceNumber || "N/A"}
              </span>
            </div>
          </div>

          {onPrintInvoice && (
            <button
              onClick={() => onPrintInvoice(sale._id)}
              className="flex items-center gap-2 rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
            >
              <Printer size={14} />
              Print
            </button>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2">
          <DetailRow
            icon={<User size={16} />}
            label="Customer"
            value={sale.customerName || "Guest"}
          />

          {sale.customerPhone && (
            <DetailRow
              icon={<Phone size={16} />}
              label="Phone"
              value={sale.customerPhone}
            />
          )}

          <DetailRow
            icon={<Package size={16} />}
            label="Product"
            value={sale.productName || "N/A"}
          />

          <DetailRow
            icon={<DollarSign size={16} />}
            label="Unit Price"
            value={`$${unitPrice.toFixed(2)}`}
          />

          <DetailRow
            icon={<PercentIcon />}
            label="Discount"
            value={`${discount}% (-$${discountAmount.toFixed(2)})`}
          />

          <DetailRow
            icon={<TaxIcon />}
            label="Tax"
            value={`${tax}% (+$${taxAmount.toFixed(2)})`}
          />

          <DetailRow
            icon={<CreditCard size={16} />}
            label="Payment"
            value={sale.paymentMethod || "Cash"}
          />

          <DetailRow
            icon={<Calendar size={16} />}
            label="Date"
            value={
              sale.createdAt
                ? new Date(sale.createdAt).toLocaleString()
                : "N/A"
            }
          />

          {sale.sellerId?.fullName && (
            <DetailRow
              icon={<User size={16} />}
              label="Sold By"
              value={sale.sellerId.fullName}
            />
          )}
        </div>

        {/* Total */}
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-center">
          <p className="text-sm font-medium text-gray-600">
            Grand Total
          </p>
          <p className="text-2xl font-bold text-green-600">
            ${grandTotal.toFixed(2)}
          </p>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg bg-gray-100 py-2 font-semibold text-gray-700 hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* ===================== REUSABLE ROW ===================== */
function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-md bg-gray-50 px-3 py-2">
      <div className="text-blue-600">{icon}</div>
      <div className="flex-1 text-sm">
        <span className="text-gray-500">{label}:</span>{" "}
        <span className="font-semibold text-gray-900">
          {value}
        </span>
      </div>
    </div>
  );
}

/* ===================== ICONS ===================== */
function PercentIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 7h6m-6 10h6m-4-5h.01"
      />
    </svg>
  );
}

function TaxIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4"
      />
    </svg>
  );
}

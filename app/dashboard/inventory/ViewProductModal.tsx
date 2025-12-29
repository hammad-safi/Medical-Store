"use client";

import {
  X,
  Package,
  Tag,
  Hash,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Product } from "@/components/types";

interface ViewProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

export function ViewProductModal({
  open,
  onClose,
  product,
}: ViewProductModalProps) {
  if (!open || !product) return null;

  const margin =
    product.costPrice > 0
      ? (
          ((product.salePrice - product.costPrice) /
            product.costPrice) *
          100
        ).toFixed(1)
      : "0";

  const isExpiringSoon =
    new Date(product.expiry).getTime() <
    Date.now() + 30 * 24 * 60 * 60 * 1000;

  const isLowStock = product.stock < 50;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Product Details
            </h2>
            <p className="text-sm text-gray-500">
              Complete inventory information
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Alerts */}
          {(isLowStock || isExpiringSoon) && (
            <div className="grid gap-3 sm:grid-cols-2">
              {isLowStock && (
                <AlertCard
                  icon={<AlertCircle />}
                  bg="bg-red-50"
                  text="text-red-700"
                  title="Low Stock"
                  value={`${product.stock} units left`}
                />
              )}

              {isExpiringSoon && (
                <AlertCard
                  icon={<Calendar />}
                  bg="bg-orange-50"
                  text="text-orange-700"
                  title="Expiring Soon"
                  value={new Date(product.expiry).toLocaleDateString()}
                />
              )}
            </div>
          )}

          {/* Details Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailRow
              icon={<Package />}
              label="Product Name"
              value={product.name}
            />
            <DetailRow
              icon={<Tag />}
              label="Category"
              value={product.category}
            />
            <DetailRow
              icon={<Hash />}
              label="Stock Quantity"
              value={product.stock.toString()}
            />
            <DetailRow
              icon={<DollarSign />}
              label="Cost Price"
              value={`$${product.costPrice.toFixed(2)}`}
            />
            <DetailRow
              icon={<DollarSign />}
              label="Sale Price"
              value={`$${product.salePrice.toFixed(2)}`}
            />
            <DetailRow
              icon={<TrendingUp />}
              label="Profit Margin"
              value={`${margin}% ($${(
                product.salePrice - product.costPrice
              ).toFixed(2)})`}
              valueClass={
                Number(margin) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }
            />
            <DetailRow
              icon={<Calendar />}
              label="Expiry Date"
              value={new Date(product.expiry).toLocaleDateString()}
            />
          </div>

          {/* Inventory Value */}
          <div className="rounded-xl bg-blue-50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="font-medium text-gray-700">
              Total Inventory Value
            </span>
            <span className="text-2xl font-bold text-blue-600">
              ${(product.stock * product.salePrice).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gray-100 hover:bg-gray-200 py-3 font-semibold text-gray-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Small Components -------------------- */

function AlertCard({
  icon,
  title,
  value,
  bg,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  bg: string;
  text: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl p-4 ${bg} ${text}`}
    >
      {icon}
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  valueClass = "text-gray-900",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl bg-gray-50 p-4 hover:bg-gray-100 transition">
      <div className="text-blue-600 mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </p>
        <p className={`text-base font-semibold ${valueClass}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

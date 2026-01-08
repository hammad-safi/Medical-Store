


"use client";
import { useState, useEffect } from "react";
import { X, Package, Tag, Hash, DollarSign, Calendar, TrendingUp } from "lucide-react";
import { Product } from "@/components/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: Omit<Product, "_id">) => void;
  product?: Product | null;
}

const CATEGORIES = [
  "Tablets",
  "Capsules",
  "Syrups",
  "Injections",
  "Creams",
  "Medical Devices",
  "Supplements",
  "Others",
];

export default function AddEditModal({ open, onClose, onSubmit, product }: Props) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    stock: "",
    costPrice: "",
    salePrice: "",
    expiry: "",
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        category: product.category,
        stock: String(product.stock),
        costPrice: String(product.costPrice || ""),
        salePrice: String(product.salePrice),
        expiry: product.expiry.slice(0, 10),
      });
    } else {
      setForm({
        name: "",
        category: "",
        stock: "",
        costPrice: "",
        salePrice: "",
        expiry: "",
      });
    }
  }, [product]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      name: form.name,
      category: form.category,
      stock: Number(form.stock),
      costPrice: Number(form.costPrice) || 0,
      salePrice: Number(form.salePrice),
      expiry: form.expiry,
      price: 0
    });

    onClose();
  };
  

  const margin = form.costPrice && form.salePrice 
    ? ((Number(form.salePrice) - Number(form.costPrice)) / Number(form.costPrice) * 100).toFixed(1)
    : "0";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-bold mb-4">
          {product ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Package size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Product name"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="relative">
            <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              name="stock"
              placeholder="Stock quantity"
              value={form.stock}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              min="0"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                name="costPrice"
                placeholder="Cost price"
                value={form.costPrice}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                min="0"
                step="0.01"
              />
            </div>

            <div className="relative">
              <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                name="salePrice"
                placeholder="Sale price"
                value={form.salePrice}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Margin Display */}
          {form.costPrice && form.salePrice && Number(form.costPrice) > 0 && (
            <div className="p-2 bg-blue-50 rounded-md flex items-center justify-between">
              <span className="text-sm text-gray-600">Profit Margin:</span>
              <span className={`flex items-center gap-1 font-semibold ${Number(margin) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp size={14} />
                {margin}%
              </span>
            </div>
          )}

          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              name="expiry"
              value={form.expiry}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {product ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
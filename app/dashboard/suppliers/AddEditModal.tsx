"use client";
import { useState, useEffect } from "react";
import { X, User, Mail, Phone, MapPin } from "lucide-react";
import { Supplier } from "@/components/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: Omit<Supplier, "_id">) => void;
  supplier?: Supplier | null;
}

export default function AddEditModal({ open, onClose, onSubmit, supplier }: Props) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (supplier) {
      setForm({
        name: supplier.name,
        phone: supplier.phone || "",
        email: supplier.email || "",
        address: supplier.address || "",
      });
    } else {
      setForm({
        name: "",
        phone: "",
        email: "",
        address: "",
      });
    }
  }, [supplier]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-5 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>

        <h2 className="text-lg font-bold mb-4">
          {supplier ? "Edit Supplier" : "Add Supplier"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Supplier name"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              value={form.phone}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="w-1/2 py-2 border rounded-md text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="w-1/2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              {supplier ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
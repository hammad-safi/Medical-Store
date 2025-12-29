"use client";

import { X, Building, Phone, Mail, MapPin, Calendar, Edit, Trash2 } from "lucide-react";

interface Supplier {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ViewSupplierModalProps {
  open: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  onEdit?: (supplier: Supplier) => void;
  onDelete?: (id: string) => void;
}

export function ViewSupplierModal({ open, onClose, supplier, onEdit, onDelete }: ViewSupplierModalProps) {
  if (!open || !supplier) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Supplier Details</h2>
              <p className="text-sm text-gray-500 mt-0.5">ID: {supplier._id.substring(0, 8)}...</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Supplier Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{supplier.name}</h3>
                <p className="text-sm text-gray-500">Supplier</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              {supplier.phone && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{supplier.phone}</p>
                  </div>
                </div>
              )}

              {supplier.email && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Mail className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900 break-all">{supplier.email}</p>
                  </div>
                </div>
              )}

              {supplier.address && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg mt-1">
                    <MapPin className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium text-gray-900">{supplier.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Calendar className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium text-gray-900">{formatDate(supplier.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Updated</p>
                    <p className="font-medium text-gray-900">{formatDate(supplier.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Placeholder */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Purchase Statistics</h4>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-500 text-sm">Statistics coming soon</p>
              <p className="text-xs text-gray-400 mt-1">Track total purchases, spending, and order history</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t flex gap-3">
          {onDelete && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this supplier?")) {
                  onDelete(supplier._id);
                }
              }}
              className="flex-1 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => {
                onEdit(supplier);
                onClose();
              }}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
            >
              <Edit size={16} />
              Edit
            </button>
          )}
          {!onEdit && !onDelete && (
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/toast";
import { DataTableHeader } from "@/components/data-table";
import DataTableActions from "@/components/data-table/tableAction";
import DataTable from "@/components/data-table/dataTable";
import AddEditModal from "./AddEditModal";
import { ViewSupplierModal } from "./viewSupplierModal";
import { useAuth } from "@/app/hooks/useAuth";
import api from "@/app/lib/axios";
import { Supplier, ToastType } from "@/components/types";

export default function SuppliersPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("name");
  const [toast, setToast] = useState<ToastType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewSupplier, setViewSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!token && !user) {
      router.push("/login");
    }
  }, [token, user, router]);

  const fetchSuppliers = async (page = 1) => {
    if (!token) return;
    
    setLoading(true);
    try {
      const res = await api.get(`/suppliers?page=${page}&limit=10`);
      console.log("Suppliers API Response:", res.data);
      
      if (res.data?.data?.suppliers && Array.isArray(res.data.data.suppliers)) {
        setSuppliers(res.data.data.suppliers);
        if (res.data.data.pagination) {
          setPagination(res.data.data.pagination);
        }
      } else if (Array.isArray(res.data?.data)) {
        setSuppliers(res.data.data);
      } else if (Array.isArray(res.data)) {
        setSuppliers(res.data);
      } else {
        console.warn("Unexpected API response format:", res.data);
        setSuppliers([]);
      }
    } catch (err: any) {
      console.error("Error fetching suppliers:", err);
      const errorMessage = err.response?.data?.message || "Failed to fetch suppliers";
      showToast(errorMessage, "error");
      
      setSuppliers([]);
      
      if (err.response?.status === 401) {
        setTimeout(() => router.push("/login"), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSuppliers();
    }
  }, [token]);

  const handleDelete = async () => {
    if (!selected.length || !token) return;

    setDeleteLoading(true);
    try {
      await api.delete("/suppliers", {
        data: { ids: selected },
      });
      showToast(`${selected.length} supplier${selected.length > 1 ? 's' : ''} deleted successfully`);
      setSelected([]);
      fetchSuppliers(pagination.page);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Delete failed";
      showToast(errorMessage, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleModalSubmit = async (form: Omit<Supplier, "_id">) => {
    if (!token) {
      showToast("Please login first", "error");
      return;
    }

    try {
      if (editSupplier) {
        const response = await api.put(`/suppliers/${editSupplier._id}`, form);
        showToast(response.data?.message || "Supplier updated successfully");
      } else {
        const response = await api.post("/suppliers", form);
        showToast(response.data?.message || "Supplier added successfully");
      }
      setModalOpen(false);
      fetchSuppliers(pagination.page);
    } catch (err: any) {
      console.error("Error saving supplier:", err);
      const errorMessage = err.response?.data?.message || "Failed to save supplier";
      showToast(errorMessage, "error");
      throw err;
    }
  };

  const filtered = useMemo(() => {
    if (!Array.isArray(suppliers)) {
      return [];
    }
    
    let result = suppliers.filter(supplier => {
      const searchFields = [
        supplier.name,
        supplier.email,
        supplier.phone,
        supplier.address,
        supplier.companyName
      ].filter(Boolean);
      
      return searchFields.some(field => 
        field.toLowerCase().includes(search.toLowerCase())
      );
    });

    result.sort((a, b) => {
      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (sortBy === "email") {
        return (a.email || "").localeCompare(b.email || "");
      }
      if (sortBy === "phone") {
        return (a.phone || "").localeCompare(b.phone || "");
      }
      return 0;
    });

    return result;
  }, [suppliers, search, sortBy]);

  const handlePageChange = (newPage: number) => {
    fetchSuppliers(newPage);
  };

  const handleExport = () => {
    const headers = ["Name", "Company", "Email", "Phone", "Address", "Contact Person", "Website"];
    const csvData = filtered.map(supplier => [
      supplier.name || "",
      supplier.companyName || "",
      supplier.email || "",
      supplier.phone || "",
      supplier.address || "",
      supplier.contactPerson || "",
      supplier.website || ""
    ]);
    
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suppliers_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showToast("Export completed successfully", "success");
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 space-y-6">
      {loading && (
        <div className="fixed inset-0 bg-black/10 z-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Loading suppliers...</span>
          </div>
        </div>
      )}

      <DataTableHeader
        title="Suppliers"
        subtitle={`Total Suppliers: ${pagination.total} | Page ${pagination.page} of ${pagination.pages}`}
        search={search}
        setSearch={setSearch}
        suggestions={filtered}
        onAdd={() => {
          setEditSupplier(null);
          setModalOpen(true);
        }}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterCategory=""
        setFilterCategory={() => {}}
        categories={[]}
        showAddButton={true}
        onExport={handleExport}
      />

      {/* <DataTableActions
        search={search}
        setSearch={setSearch}
        suggestions={filtered}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterCategory=""
        setFilterCategory={() => {}}
        categories={[]}
        selectedCount={selected.length}
        onReload={() => fetchSuppliers(pagination.page)}
        onDelete={handleDelete}
        deleteLoading={deleteLoading}
        onExport={handleExport}
        pagination={pagination}
        onPageChange={handlePageChange}
      /> */}

      {!loading && (!Array.isArray(suppliers) || suppliers.length === 0) ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Suppliers Found</h3>
          <p className="text-gray-500 mb-6">Add your first supplier to get started</p>
          <button
            onClick={() => {
              setEditSupplier(null);
              setModalOpen(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add First Supplier
          </button>
        </div>
      ) : (
        <>
          <DataTable
            columns={[
              { key: "name", label: "Name" },
              { key: "companyName", label: "Company" },
              { key: "email", label: "Email" },
              { key: "phone", label: "Phone" },
              { key: "address", label: "Address" },
            ]}
            data={filtered}
            selected={selected}
            setSelected={setSelected}
            onEdit={supplier => {
              setEditSupplier(supplier);
              setModalOpen(true);
            }}
            onView={supplier => {
              setViewSupplier(supplier);
              setViewOpen(true);
            }}
          />
          
          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              <span className="px-4 py-2">
                Page {pagination.page} of {pagination.pages}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <AddEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        supplier={editSupplier}
      />

      <ViewSupplierModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        supplier={viewSupplier}
      />

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
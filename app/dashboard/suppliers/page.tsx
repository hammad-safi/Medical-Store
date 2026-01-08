"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/toast";
import { DataTableHeader } from "@/components/data-table";
import DataTable from "@/components/data-table/dataTable";
import AddEditModal from "./AddEditModal";
import { ViewSupplierModal } from "./viewSupplierModal";
import { useAuth } from "@/app/hooks/useAuth";
import api from "@/app/lib/axios";
import { Supplier, ToastType } from "@/components/types";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader } from "lucide-react";
import { useSuppliersData } from "@/app/hooks/useApiData";

// Custom hook for suppliers operations
const useSuppliers = (page: number = 1, limit: number = 10, search: string = "", sortBy: string = "name") => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Use app data hook for suppliers
  const {
    suppliers: allSuppliers,
    isLoading,
    isFetching,
    isPreviousData,
    refetch: refetchSuppliers
  } = useSuppliersData();

  // Add supplier mutation
  const addSupplierMutation = useMutation({
    mutationFn: async (form: Omit<Supplier, "_id">) => {
      const response = await api.post("/suppliers", form);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-data'] });
    },
  });

  // Update supplier mutation
  const updateSupplierMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<Supplier> }) => {
      const response = await api.put(`/suppliers/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-data'] });
    },
  });

  // Delete suppliers mutation
  const deleteSuppliersMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await api.delete("/suppliers", {
        data: { ids },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-data'] });
    },
  });

  // Filter and paginate suppliers locally
  const filteredSuppliers = useMemo(() => {
    if (!Array.isArray(allSuppliers)) return [];

    return allSuppliers.filter(supplier => {
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
  }, [allSuppliers, search]);

  // Sort suppliers
  const sortedSuppliers = useMemo(() => {
    return [...filteredSuppliers].sort((a, b) => {
      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (sortBy === "email") {
        return (a.email || "").localeCompare(b.email || "");
      }
      if (sortBy === "phone") {
        return (a.phone || "").localeCompare(b.phone || "");
      }
      if (sortBy === "company") {
        return (a.companyName || "").localeCompare(b.companyName || "");
      }
      return 0;
    });
  }, [filteredSuppliers, sortBy]);

  // Apply pagination
  const paginatedSuppliers = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return sortedSuppliers.slice(startIndex, endIndex);
  }, [sortedSuppliers, page, limit]);

  return {
    suppliers: paginatedSuppliers,
    pagination: {
      page,
      limit,
      total: filteredSuppliers.length,
      pages: Math.ceil(filteredSuppliers.length / limit)
    },
    isLoading,
    isFetching,
    isPreviousData,
    refetch: refetchSuppliers,
    addSupplier: addSupplierMutation,
    updateSupplier: updateSupplierMutation,
    deleteSuppliers: deleteSuppliersMutation,
  };
};

export default function SuppliersPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  
  // Local state
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("name");
  const [toast, setToast] = useState<ToastType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewSupplier, setViewSupplier] = useState<Supplier | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // React Query hooks
  const {
    suppliers,
    pagination,
    isLoading,
    isFetching,
    isPreviousData,
    refetch,
    addSupplier,
    updateSupplier,
    deleteSuppliers,
  } = useSuppliers(currentPage, itemsPerPage, search, sortBy);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Redirect if not authenticated
  if (!token && !user) {
    router.push("/login");
    return null;
  }

  // Delete handler
  const handleDelete = async () => {
    if (!selected.length || !token) return;

    try {
      await deleteSuppliers.mutateAsync(selected);
      showToast(`${selected.length} supplier${selected.length > 1 ? 's' : ''} deleted successfully`);
      setSelected([]);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Delete failed";
      showToast(errorMessage, "error");
    }
  };

  // Add/Edit handler
  const handleModalSubmit = async (form: Omit<Supplier, "_id">) => {
    if (!token) {
      showToast("Please login first", "error");
      return;
    }

    try {
      if (editSupplier) {
        await updateSupplier.mutateAsync({ 
          id: editSupplier._id, 
          data: form 
        });
        showToast("Supplier updated successfully");
      } else {
        await addSupplier.mutateAsync(form);
        showToast("Supplier added successfully");
      }
      setModalOpen(false);
      setEditSupplier(null);
    } catch (err: any) {
      console.error("Error saving supplier:", err);
      const errorMessage = err.response?.data?.message || "Failed to save supplier";
      showToast(errorMessage, "error");
      throw err;
    }
  };

  // Filter suppliers for suggestions
  const filteredSuggestions = useMemo(() => {
    if (!Array.isArray(suppliers)) {
      return [];
    }
    
    return suppliers.filter(supplier => {
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
    }).slice(0, 5);
  }, [suppliers, search]);

  // Page change handler
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Items per page change handler
  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  // Export handler
  const handleExport = () => {
    const headers = ["Name", "Company", "Email", "Phone", "Address", "Contact Person", "Website"];
    const csvData = suppliers.map(supplier => [
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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading suppliers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 space-y-6">
      {/* Cached data indicator */}
      {isPreviousData && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg animate-pulse">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span className="text-yellow-800 text-sm font-medium">Updating suppliers data...</span>
        </div>
      )}

      {/* Global loading overlay */}
      {(addSupplier.isPending || updateSupplier.isPending || deleteSuppliers.isPending || isFetching) && (
        <div className="fixed inset-0 bg-black/10 z-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
            <Loader className="w-6 h-6 text-blue-600 animate-spin" />
            <span className="text-gray-700">
              {addSupplier.isPending ? "Adding supplier..." :
               updateSupplier.isPending ? "Updating supplier..." :
               deleteSuppliers.isPending ? "Deleting suppliers..." :
               "Refreshing suppliers..."}
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <DataTableHeader
        title="Suppliers"
        subtitle={`Total Suppliers: ${pagination.total} | Page ${pagination.page} of ${pagination.pages}`}
        search={search}
        setSearch={setSearch}
        suggestions={filteredSuggestions}
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
        selectedCount={selected.length}
        onRefresh={refetch}
        isRefreshing={isFetching}
        onBulkDelete={selected.length > 0 ? handleDelete : undefined}
        sortOptions={[
          { value: "name", label: "Name (A-Z)" },
          { value: "company", label: "Company (A-Z)" },
          { value: "email", label: "Email (A-Z)" },
          { value: "phone", label: "Phone (A-Z)" }
        ]}
      />

      {/* Empty state */}
      {!isLoading && suppliers.length === 0 ? (
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
        /* Data Table */
        <DataTable
          columns={[
            { 
              key: "name", 
              label: "Name", 
              type: "text",
              // cellRenderer: (value: string, row: Supplier) => (
              //   <div className="font-medium text-gray-900">{value || "N/A"}</div>
              // )
            },
            // { 
            //   key: "companyName", 
            //   label: "Company", 
            //   type: "text",
            //   // cellRenderer: (value: string) => (
            //   //   <span className="text-gray-700">{value || "N/A"}</span>
            //   // )
            // },
            { 
              key: "email", 
              label: "Email", 
              type: "text",
              // cellRenderer: (value: string) => (
              //   <a 
              //     href={`mailto:${value}`} 
              //     className="text-blue-600 hover:text-blue-800 hover:underline"
              //     onClick={(e) => e.stopPropagation()}
              //   >
              //     {value || "N/A"}
              //   </a>
              // )
            },
            { 
              key: "phone", 
              label: "Phone", 
              type: "text",
              // cellRenderer: (value: string) => (
              //   <a 
              //     href={`tel:${value}`} 
              //     className="text-green-600 hover:text-green-800"
              //     onClick={(e) => e.stopPropagation()}
              //   >
              //     {value || "N/A"}
              //   </a>
              // )
            },
            { 
              key: "address", 
              label: "Address", 
              type: "text",
              // cellRenderer: (value: string) => (
              //   <div className="truncate max-w-xs text-gray-600">{value || "N/A"}</div>
              // )
            },
          ]}
          data={suppliers.map(s => ({
            ...s,
            phone: s.phone || "",
            address: s.address || "",
            companyName: s.companyName || "",
            email: s.email || ""
          }))}
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
          showEdit={true}
          showRowMenu={true}
          rowMenuItems={[
            {
              label: "View Details",
              icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ),
              onClick: (supplier) => {
                setViewSupplier(supplier);
                setViewOpen(true);
              }
            },
            {
              label: "Edit Supplier",
              icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              ),
              onClick: (supplier) => {
                setEditSupplier(supplier);
                setModalOpen(true);
              }
            },
            {
              label: "Delete",
              icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              ),
              onClick: (supplier) => {
                setSelected([supplier._id]);
                setTimeout(() => handleDelete(), 100);
              },
              variant: 'danger'
            }
          ]}
          pagination={{
            currentPage: pagination.page,
            totalPages: pagination.pages,
            totalItems: pagination.total,
            itemsPerPage: pagination.limit,
            onPageChange: handlePageChange,
            onItemsPerPageChange: handleItemsPerPageChange,
          }}
          loading={isLoading || isFetching}
        />
      )}

      {/* Modals */}
      <AddEditModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditSupplier(null);
        }}
        onSubmit={handleModalSubmit}
        supplier={editSupplier}
        isSubmitting={addSupplier.isPending || updateSupplier.isPending}
      />

      <ViewSupplierModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        supplier={viewSupplier}
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
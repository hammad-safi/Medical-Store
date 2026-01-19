"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/toast";
import { DataTableHeader } from "@/components/data-table";
import DataTable from "@/components/data-table/dataTable";
import { AddSaleModal } from "./AddSaleModal";
import { ViewSaleModal } from "./ViewSaleModal";
import { useAuth } from "@/app/hooks/useAuth";
import api from "@/app/lib/axios";
import { ToastType } from "@/components/types";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader } from "lucide-react";
import { useSalesData } from "@/app/hooks/useApiData";

/* ================= TYPES ================= */
interface SaleItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface Seller {
  _id: string;
  fullName: string;
}

export interface Sale {
  _id: string;
  invoiceNumber: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paymentMethod: string;
  customerName: string;
  createdAt: string;
  sellerId: Seller;
}

// Custom hook for sales operations
const useSales = (page: number = 1, limit: number = 10, search: string = "") => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Use app data hook for sales
  const {
    sales: allSales,
    isLoading,
    isFetching,
    isPreviousData,
    refetch: refetchSales
  } = useSalesData();

  // Add sale mutation
  const addSaleMutation = useMutation({
    mutationFn: async (saleData: any) => {
      const res = await api.post("/sales", saleData);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-data'] });
    },
  });

  // Delete sales mutation
  const deleteSalesMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const res = await api.delete("/sales", { data: { ids } });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-data'] });
    },
  });

  // Filter and paginate sales locally
const filteredSales = useMemo(() => {
  const q = search.toLowerCase();

  return allSales.filter(sale => {
    const productNames =
      sale.items?.map(item => item.productName).join(" ").toLowerCase() || "";

    return (
      sale.customerName?.toLowerCase().includes(q) ||
      sale.invoiceNumber?.toLowerCase().includes(q) ||
      sale.paymentMethod?.toLowerCase().includes(q) ||
      sale.sellerId?.fullName?.toLowerCase().includes(q) ||
      productNames.includes(q)
    );
  });
}, [allSales, search]);


  // Sort by date (newest first)
  const sortedSales = useMemo(() => {
    return [...filteredSales].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredSales]);

  // Apply pagination
  const paginatedSales = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return sortedSales.slice(startIndex, endIndex);
  }, [sortedSales, page, limit]);

  return {
    sales: paginatedSales,
    pagination: {
      page,
      limit,
      total: filteredSales.length,
      pages: Math.ceil(filteredSales.length / limit)
    },
    isLoading,
    isFetching,
    isPreviousData,
    refetch: refetchSales,
    addSale: addSaleMutation,
    deleteSales: deleteSalesMutation,
  };
};

/* ================= PAGE ================= */
export default function SalesPage() {
  const router = useRouter();
  const { token } = useAuth();

  // Local state
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [toast, setToast] = useState<ToastType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewSale, setViewSale] = useState<Sale | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // React Query hooks
  const {
    sales,
    pagination,
    isLoading,
    isFetching,
    isPreviousData,
    refetch,
    addSale,
    deleteSales,
  } = useSales(currentPage, itemsPerPage, search);

  /* ================= HELPERS ================= */
  const showToast = (message: string, type: ToastType["type"] = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Redirect if not authenticated
  if (!token) {
    router.push("/login");
    return null;
  }

  /* ================= HANDLERS ================= */
  const handleAddSale = async (saleData: any) => {
    if (!token) {
      showToast("Please login first", "error");
      return;
    }

    try {
      const result = await addSale.mutateAsync(saleData);
      showToast("Sale recorded successfully", "success");
      setModalOpen(false);
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to record sale";
      showToast(errorMessage, "error");
      throw err;
    }
  };

  const handleDeleteSales = async () => {
    if (!selected.length || !token) return;

    try {
      await deleteSales.mutateAsync(selected);
      showToast(`${selected.length} sale${selected.length > 1 ? 's' : ''} deleted successfully`);
      setSelected([]);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Delete failed";
      showToast(errorMessage, "error");
    }
  };

  const handlePrintInvoice = (saleId: string) => {
    const invoiceUrl = `/api/sales/invoice/${saleId}`;
    window.open(invoiceUrl, '_blank');
  };

  const handleView = (sale: Sale) => {
    setViewSale(sale);
    setViewOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleExport = () => {
    try {
      const headers = ["Invoice #", "Customer", "Products", "Quantity", "Subtotal", "Discount", "Tax", "Grand Total", "Payment", "Date", "Seller"];
      
      const csvData = sales.map(sale => {
        const productNames = sale.items?.map((item: { productName: any; }) => item.productName).join(", ") || "N/A";
        const totalQuantity = sale.items?.reduce((sum: any, item: { quantity: any; }) => sum + (item.quantity || 0), 0) || 0;
        
        return [
          sale.invoiceNumber || "",
          sale.customerName || "Walk-in Customer",
          productNames,
          totalQuantity,
          `$${(sale.subtotal || 0).toFixed(2)}`,
          `${sale.discount || 0}%`,
          `${sale.tax || 0}%`,
          `$${(sale.grandTotal || 0).toFixed(2)}`,
          sale.paymentMethod || "Cash",
          sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : "",
          sale.sellerId?.fullName || ""
        ];
      });
      
      const csvContent = [
        headers.join(","),
        ...csvData.map(row => row.join(","))
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sales_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      showToast("Export completed successfully", "success");
    } catch (error) {
      showToast("Export failed", "error");
    }
  };

  /* ================= DATA TRANSFORMATIONS ================= */
  const tableData = useMemo(() => 
    sales.map(sale => ({
      ...sale,
      productName: sale.items?.map((item: { productName: any; }) => item.productName).join(", ") || "N/A",
      quantity: sale.items?.reduce((sum: any, item: { quantity: any; }) => sum + item.quantity, 0) || 0,
      grandTotal: sale.grandTotal || 0,
      createdAt: sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : "N/A",
      customerName: sale.customerName || "Walk-in Customer",
    })), 
    [sales]
  );

  const totalRevenue = useMemo(() => 
    sales.reduce((sum, sale) => sum + (sale.grandTotal || 0), 0), 
    [sales]
  );

  const suggestions = useMemo(() => {
    return sales.slice(0, 5).map(sale => ({
      _id: sale._id,
      name: sale.invoiceNumber || "N/A",
      category: sale.customerName || "N/A"
    }));
  }, [sales]);

  const paymentMethods = ['Cash', 'Card', 'UPI', 'Credit'];

  /* ================= LOADING STATE ================= */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading sales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4 md:p-6 space-y-6">
      {/* Cached data indicator */}
      {isPreviousData && (
        <div className="fixed top-4 right-4 z-50 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 flex items-center gap-2 shadow-lg animate-pulse">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span className="text-yellow-800 text-sm font-medium">Updating sales data...</span>
        </div>
      )}

      {/* Global loading overlay */}
      {(addSale.isPending || deleteSales.isPending || isFetching) && (
        <div className="fixed inset-0 bg-black/10 z-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
            <Loader className="w-6 h-6 text-blue-600 animate-spin" />
            <span className="text-gray-700">
              {addSale.isPending ? "Recording sale..." :
               deleteSales.isPending ? "Deleting sales..." :
               "Refreshing sales..."}
            </span>
          </div>
        </div>
      )}

      {/* Data Table Header */}
      <DataTableHeader
        title="Sales"
        subtitle={`Total Revenue: $${totalRevenue.toFixed(2)} | Total Sales: ${pagination.total} | Page ${pagination.page} of ${pagination.pages}`}
        search={search}
        setSearch={setSearch}
        suggestions={suggestions}
        onAdd={() => setModalOpen(true)}
        sortBy="date"
        setSortBy={() => {}} // Not used in this component
        filterCategory=""
        setFilterCategory={() => {}} // Not used in this component
        categories={paymentMethods}
        showAddButton={true}
        onExport={handleExport}
        selectedCount={selected.length}
        onRefresh={refetch}
        isRefreshing={isFetching}
        onBulkDelete={selected.length > 0 ? handleDeleteSales : undefined}
      />

      {/* Empty state */}
      {!isLoading && sales.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Sales Recorded</h3>
          <p className="text-gray-500 mb-6">Make your first sale to get started</p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Record First Sale
          </button>
        </div>
      ) : (
        /* Data Table */
        <DataTable
          columns={[
            { key: "invoiceNumber", label: "Invoice #", type: "text" },
            { key: "customerName", label: "Customer", type: "text" },
            { key: "productName", label: "Products", type: "text" },
            { key: "quantity", label: "Qty", type: "number" },
            { key: "grandTotal", label: "Total", type: "currency" },
            { key: "paymentMethod", label: "Payment", type: "status" },
            { key: "createdAt", label: "Date", type: "date" },
          ]}
          data={tableData}
          selected={selected}
          setSelected={setSelected}
          onView={handleView}
          onEdit={handleView} // Edit opens view modal
          showEdit={false}
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
              onClick: handleView
            },
            {
              label: "Print Invoice",
              icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              ),
              onClick: (sale) => handlePrintInvoice(sale._id)
            },
            {
              label: "Delete",
              icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              ),
              onClick: (sale) => {
                setSelected([sale._id]);
                setTimeout(() => handleDeleteSales(), 100);
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
        />
      )}

      {/* Modals */}
      <AddSaleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddSale}
        onPrintInvoice={handlePrintInvoice}
        isSubmitting={addSale.isPending}
      />

      <ViewSaleModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        sale={viewSale}
        onPrintInvoice={handlePrintInvoice}
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
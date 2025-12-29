"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/toast";
import { DataTableHeader } from "@/components/data-table";
import DataTableActions from "@/components/data-table/tableAction";
import DataTable from "@/components/data-table/dataTable";
import { AddSaleModal } from "./AddSaleModal";
import { ViewSaleModal } from "./ViewSaleModal";
import { useAuth } from "@/app/hooks/useAuth";
import api from "@/app/lib/axios";
import { Sale, ToastType } from "@/components/types";

interface SaleItem {
  inventoryId: {
    _id: string;
    name: string;
    category: string;
  };
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Seller {
  _id: string;
  fullName: string;
  email: string;
}

interface ExtendedSale {
  _id: string;
  invoiceNumber: string;
  productName?: string;
  unitPrice?: number;
  quantity?: number;
  totalAmount?: number;
  discountAmount?: number;
  taxAmount?: number;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paymentMethod: string;
  customerName: string;
  customerPhone: string;
  sellerId: Seller;
  createdAt: string;
}

export default function SalesPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [sales, setSales] = useState<ExtendedSale[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("date");
  const [filterPayment, setFilterPayment] = useState("");
  const [toast, setToast] = useState<ToastType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewSale, setViewSale] = useState<ExtendedSale | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
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

  const fetchSales = async (page = 1) => {
    if (!token) return;
    
    setLoading(true);
    try {
      const res = await api.get(`/sales?page=${page}&limit=10`);
      console.log("Sales API Response:", res.data); // Debug log
      
      // Check if data structure matches your GET response
      if (res.data?.data?.sales && Array.isArray(res.data.data.sales)) {
        setSales(res.data.data.sales);
        if (res.data.data.pagination) {
          setPagination(res.data.data.pagination);
        }
      } else if (Array.isArray(res.data?.data)) {
        // Fallback for different API structure
        setSales(res.data.data);
      } else if (Array.isArray(res.data)) {
        // Another fallback
        setSales(res.data);
      } else {
        console.warn("Unexpected API response format:", res.data);
        setSales([]);
      }
    } catch (err: any) {
      console.error("Error fetching sales:", err);
      const errorMessage = err.response?.data?.message || "Failed to fetch sales";
      showToast(errorMessage, "error");
      
      setSales([]);
      
      if (err.response?.status === 401) {
        setTimeout(() => router.push("/login"), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSales();
    }
  }, [token]);

  const handleDelete = async () => {
    if (!selected.length || !token) return;

    setDeleteLoading(true);
    try {
      await api.delete("/sales", {
        data: { ids: selected },
      });
      showToast(`${selected.length} sale${selected.length > 1 ? 's' : ''} deleted successfully`);
      setSelected([]);
      fetchSales(); // Refresh sales list
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Delete failed";
      showToast(errorMessage, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddSale = async (saleData: any) => {
    if (!token) {
      showToast("Please login first", "error");
      return;
    }

    try {
      console.log("Submitting sale data:", saleData); // Debug log
      const response = await api.post("/sales", saleData);
      console.log("Sale POST response:", response.data); // Debug log
      
      if (response.data?.success) {
        showToast(response.data.message || "Sale recorded successfully");
        setModalOpen(false);
        
        // IMPORTANT: Refresh the sales list immediately
        await fetchSales(1); // Go back to page 1 to see the new sale
        
        // Return the created sale for invoice printing
        return response.data.data;
      } else {
        throw new Error(response.data?.message || "Failed to record sale");
      }
    } catch (err: any) {
      console.error("Error adding sale:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to record sale";
      showToast(errorMessage, "error");
      throw err;
    }
  };

  const handlePrintInvoice = (saleId: string) => {
    const invoiceUrl = `/api/sales/invoice/${saleId}`;
    window.open(invoiceUrl, '_blank');
  };

  const handleEdit = (sale: ExtendedSale) => {
    handleView(sale);
  };

  const handleView = (sale: ExtendedSale) => {
    setViewSale(sale);
    setViewOpen(true);
  };

  const getProductNames = (sale: ExtendedSale): string => {
    if (sale.items && sale.items.length > 0) {
      return sale.items.map(item => item.productName).join(", ");
    }
    return sale.productName || "Multiple Products";
  };

  const getTotalQuantity = (sale: ExtendedSale): number => {
    if (sale.items && sale.items.length > 0) {
      return sale.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    }
    return sale.quantity || 0;
  };

  const filtered = useMemo(() => {
    if (!Array.isArray(sales)) {
      return [];
    }
    
    let result = sales.filter((sale) => {
      const productNames = getProductNames(sale);
      return (
        (sale.customerName?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (sale.invoiceNumber?.toLowerCase() || "").includes(search.toLowerCase()) ||
        productNames.toLowerCase().includes(search.toLowerCase())
      );
    });

    if (filterPayment) {
      result = result.filter(sale => sale.paymentMethod === filterPayment);
    }

    result.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "total") {
        return b.grandTotal - a.grandTotal;
      }
      if (sortBy === "customer") {
        return (a.customerName || "").localeCompare(b.customerName || "");
      }
      if (sortBy === "invoice") {
        return (a.invoiceNumber || "").localeCompare(b.invoiceNumber || "");
      }
      return 0;
    });

    return result;
  }, [sales, search, sortBy, filterPayment]);

  const paymentMethods = ['Cash', 'Card', 'UPI', 'Credit'];
  const totalRevenue = useMemo(() => 
    Array.isArray(sales) ? sales.reduce((sum, sale) => sum + (sale.grandTotal || 0), 0) : 0
  , [sales]);

  const tableData = useMemo(() => {
    return filtered.map(sale => ({
      ...sale,
      productName: getProductNames(sale),
      quantity: getTotalQuantity(sale),
      customerName: sale.customerName || "Walk-in Customer",
      paymentMethod: sale.paymentMethod || "Cash",
      createdAt: sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : "N/A",
      grandTotal: sale.grandTotal ? `$${sale.grandTotal.toFixed(2)}` : "$0.00",
      // Add raw values for sorting
      _raw: {
        date: new Date(sale.createdAt).getTime(),
        total: sale.grandTotal,
        customer: sale.customerName || "",
        invoice: sale.invoiceNumber || ""
      }
    }));
  }, [filtered]);

  const handlePageChange = (newPage: number) => {
    fetchSales(newPage);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4 md:p-6 space-y-6">
      {loading && (
        <div className="fixed inset-0 bg-black/10 z-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Loading sales...</span>
          </div>
        </div>
      )}

      <DataTableHeader
        title="Sales"
        subtitle={`Total Revenue: $${totalRevenue.toFixed(2)} | Total Sales: ${pagination.total} | Page ${pagination.page} of ${pagination.pages}`}
        search={search}
        setSearch={setSearch}
        suggestions={filtered}
        onAdd={() => setModalOpen(true)}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterCategory={filterPayment}
        setFilterCategory={setFilterPayment}
        categories={paymentMethods}
        showAddButton={true}
        onExport={() => {
          const headers = ["Invoice #", "Customer", "Products", "Quantity", "Subtotal", "Discount", "Tax", "Grand Total", "Payment", "Date", "Seller"];
          const csvData = filtered.map(sale => [
            sale.invoiceNumber || "",
            sale.customerName || "",
            getProductNames(sale),
            getTotalQuantity(sale),
            `$${(sale.subtotal || 0).toFixed(2)}`,
            `${sale.discount || 0}%`,
            `${sale.tax || 0}%`,
            `$${(sale.grandTotal || 0).toFixed(2)}`,
            sale.paymentMethod || "",
            sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : "",
            sale.sellerId?.fullName || ""
          ]);
          
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
        }}
      />

      {/* <DataTableActions
        search={search}
        setSearch={setSearch}
        suggestions={filtered}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterCategory={filterPayment}
        setFilterCategory={setFilterPayment}
        categories={paymentMethods}
        selectedCount={selected.length}
        onReload={() => fetchSales(pagination.page)}
        onDelete={handleDelete}
        deleteLoading={deleteLoading}
        onExport={() => {
          const headers = ["Invoice #", "Customer", "Products", "Quantity", "Subtotal", "Discount", "Tax", "Grand Total", "Payment", "Date", "Seller"];
          const csvData = filtered.map(sale => [
            sale.invoiceNumber || "",
            sale.customerName || "",
            getProductNames(sale),
            getTotalQuantity(sale),
            `$${(sale.subtotal || 0).toFixed(2)}`,
            `${sale.discount || 0}%`,
            `${sale.tax || 0}%`,
            `$${(sale.grandTotal || 0).toFixed(2)}`,
            sale.paymentMethod || "",
            sale.createdAt ? new Date(sale.createdAt).toLocaleDateString() : "",
            sale.sellerId?.fullName || ""
          ]);
          
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
        }}
        pagination={pagination}
        onPageChange={handlePageChange}
      /> */}

      {!loading && (!Array.isArray(sales) || sales.length === 0) ? (
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
        <>
          <DataTable
            columns={[
              { key: "invoiceNumber", label: "Invoice #" },
              { key: "customerName", label: "Customer" },
              { key: "productName", label: "Products" },
              { key: "quantity", label: "Qty" },
              { key: "grandTotal", label: "Total" },
              { key: "paymentMethod", label: "Payment" },
              { key: "createdAt", label: "Date" },
            ]}
            data={tableData}
            selected={selected}
            setSelected={setSelected}
            onEdit={handleEdit}
            onView={handleView}
            showEdit={false}
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

      <AddSaleModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleAddSale}
        onPrintInvoice={handlePrintInvoice}
        preSelectedProduct={selectedProduct}
      />

      <ViewSaleModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        sale={viewSale}
        onPrintInvoice={handlePrintInvoice}
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
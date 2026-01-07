// "use client"
// import { useQuery, useQueries } from '@tanstack/react-query';
// import api from '@/app/lib/axios';
// import { useAuth } from './useAuth';

// // Define types for all data
// export interface Product {
//   _id: string;
//   name: string;
//   category: string;
//   stock: number;
//   price: number;
//   salePrice: number;
//   costPrice: number;
//   expiry?: string;
//   createdAt: string;
// }

// export interface SaleItem {
//   productName: string;
//   quantity: number;
//   unitPrice: number;
//   total: number;
// }

// export interface Sale {
//   _id: string;
//   invoiceNumber: string;
//   items: SaleItem[];
//   subtotal: number;
//   discount: number;
//   tax: number;
//   grandTotal: number;
//   paymentMethod: string;
//   customerName: string;
//   createdAt: string;
// }

// export interface PurchaseItem {
//   productName: string;
//   quantity: number;
//   unitCost: number;
//   total: number;
// }

// export interface Purchase {
//   _id: string;
//   invoiceNumber: string;
//   items: PurchaseItem[];
//   subtotal: number;
//   taxAmount: number;
//   shippingCost: number;
//   grandTotal: number;
//   status: string;
//   paymentStatus: string;
//   supplierName: string;
//   createdAt: string;
// }

// export interface Supplier {
//   _id: string;
//   name: string;
//   companyName: string;
//   email: string;
//   phone: string;
//   address: string;
//   contactPerson?: string;
//   website?: string;
// }

// export interface DashboardStats {
//   totalProducts: number;
//   totalRevenue: number;
//   lowStockItems: number;
//   expiringSoon: number;
//   totalStockValue: number;
//   averageProductPrice: number;
//   totalUnitsInStock: number;
//   totalPurchases: number;
//   totalSales: number;
// }

// // Central hook to fetch ALL application data
// export const useAppData = () => {
//   const { token } = useAuth();

//   // Fetch all data in parallel
//   const results = useQueries({
//     queries: [
//       // Inventory
//       {
//         queryKey: ['app-data', 'inventory'],
//         queryFn: async (): Promise<Product[]> => {
//           const res = await api.get('/inventory', { params: { limit: 1000 } });
//           return res.data.data || [];
//         },
//         enabled: !!token,
//         staleTime: 5 * 60 * 1000, // 5 minutes
//         gcTime: 30 * 60 * 1000, // 30 minutes cache
//         placeholderData: (previousData) => previousData, // FIX: Use placeholderData instead of keepPreviousData
//       },
//       // Sales
//       {
//         queryKey: ['app-data', 'sales'],
//         queryFn: async (): Promise<Sale[]> => {
//           const res = await api.get('/sales', { params: { limit: 1000, lastDays: 30 } });
//           return res.data.data?.sales || [];
//         },
//         enabled: !!token,
//         staleTime: 2 * 60 * 1000, // 2 minutes
//         gcTime: 15 * 60 * 1000, // 15 minutes cache
//         placeholderData: (previousData) => previousData,
//       },
//       // Purchases
//       {
//         queryKey: ['app-data', 'purchases'],
//         queryFn: async (): Promise<Purchase[]> => {
//           const res = await api.get('/purchases', { params: { limit: 1000, lastDays: 30 } });
//           return res.data.data?.purchases || [];
//         },
//         enabled: !!token,
//         staleTime: 2 * 60 * 1000,
//         gcTime: 15 * 60 * 1000,
//         placeholderData: (previousData) => previousData,
//       },
//       // Suppliers
//       {
//         queryKey: ['app-data', 'suppliers'],
//         queryFn: async (): Promise<Supplier[]> => {
//           const res = await api.get('/suppliers', { params: { limit: 1000 } });
//           return res.data.data?.suppliers || res.data.data || [];
//         },
//         enabled: !!token,
//         staleTime: 10 * 60 * 1000, // 10 minutes
//         gcTime: 60 * 60 * 1000, // 60 minutes cache
//         placeholderData: (previousData) => previousData,
//       },
//     ],
//   });

//   // Extract individual query results
//   const [
//     inventoryQuery,
//     salesQuery,
//     purchasesQuery,
//     suppliersQuery,
//   ] = results;

//   // Helper to check if any query is loading
//   const isLoading = results.some(query => query.isLoading);
//   const isFetching = results.some(query => query.isFetching);
//   const isError = results.some(query => query.isError);
//   const errors = results.map(query => query.error).filter(Boolean);

//   // Check if we're showing placeholder data
//   const isPreviousData = results.some(query => query.isPlaceholderData);

//   // Refresh all data
//   const refreshAll = () => {
//     results.forEach(query => query.refetch());
//   };

//   // Invalidate all data (for mutations)
//   const invalidateAll = (queryClient: any) => {
//     queryClient.invalidateQueries({ queryKey: ['app-data'] });
//   };

//   return {
//     // Data
//     products: inventoryQuery.data || [],
//     sales: salesQuery.data || [],
//     purchases: purchasesQuery.data || [],
//     suppliers: suppliersQuery.data || [],
    
//     // States
//     isLoading,
//     isFetching,
//     isError,
//     errors,
//     isPreviousData,
    
//     // Individual query states
//     inventoryQuery,
//     salesQuery,
//     purchasesQuery,
//     suppliersQuery,
    
//     // Actions
//     refreshAll,
//     invalidateAll,
    
//     // Individual refetch functions
//     refetchInventory: inventoryQuery.refetch,
//     refetchSales: salesQuery.refetch,
//     refetchPurchases: purchasesQuery.refetch,
//     refetchSuppliers: suppliersQuery.refetch,
//   };
// };

// // Individual hooks for specific data
// export const useInventoryData = () => {
//   const { products, inventoryQuery, refetchInventory, isPreviousData } = useAppData();
//   return {
//     products,
//     isLoading: inventoryQuery.isLoading,
//     isFetching: inventoryQuery.isFetching,
//     isPreviousData: inventoryQuery.isPlaceholderData,
//     refetch: refetchInventory,
//   };
// };

// export const useSalesData = () => {
//   const { sales, salesQuery, refetchSales } = useAppData();
//   return {
//     sales,
//     isLoading: salesQuery.isLoading,
//     isFetching: salesQuery.isFetching,
//     isPreviousData: salesQuery.isPlaceholderData,
//     refetch: refetchSales,
//   };
// };

// export const usePurchasesData = () => {
//   const { purchases, purchasesQuery, refetchPurchases } = useAppData();
//   return {
//     purchases,
//     isLoading: purchasesQuery.isLoading,
//     isFetching: purchasesQuery.isFetching,
//     isPreviousData: purchasesQuery.isPlaceholderData,
//     refetch: refetchPurchases,
//   };
// };

// export const useSuppliersData = () => {
//   const { suppliers, suppliersQuery, refetchSuppliers } = useAppData();
//   return {
//     suppliers,
//     isLoading: suppliersQuery.isLoading,
//     isFetching: suppliersQuery.isFetching,
//     isPreviousData: suppliersQuery.isPlaceholderData,
//     refetch: refetchSuppliers,
//   };
// };

// // Dashboard-specific calculations
// export const useDashboardData = () => {
//   const { products, sales, purchases } = useAppData();
  
//   const stats = {
//     totalProducts: products.length,
//     totalRevenue: sales.reduce((sum, sale) => sum + (sale.grandTotal || 0), 0),
//     lowStockItems: products.filter(item => (item.stock || 0) <= 20).length,
//     expiringSoon: products.filter(item => {
//       if (!item.expiry) return false;
//       const expiryDate = new Date(item.expiry);
//       const threeMonthsLater = new Date();
//       threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
//       return expiryDate <= threeMonthsLater && expiryDate >= new Date();
//     }).length,
//     totalStockValue: products.reduce((sum, item) => {
//       const costPrice = item.costPrice || item.price || 0;
//       const stock = item.stock || 0;
//       return sum + (costPrice * stock);
//     }, 0),
//     averageProductPrice: products.length > 0 
//       ? products.reduce((sum, item) => sum + (item.salePrice || item.price || 0), 0) / products.length 
//       : 0,
//     totalUnitsInStock: products.reduce((sum, item) => sum + (item.stock || 0), 0),
//     totalPurchases: purchases.length,
//     totalSales: sales.length,
//   };

//   return { stats, products, sales, purchases };
// };

"use client"
import { useQuery, useQueries } from '@tanstack/react-query';
import api from '@/app/lib/axios';
import { useAuth } from './useAuth';

// Define types for all data
export interface Product {
  _id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  salePrice: number;
  costPrice: number;
  expiry?: string;
  createdAt: string;
}

export interface SaleItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
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
}

export interface PurchaseItem {
  productName: string;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface Purchase {
  _id: string;
  invoiceNumber: string;
  items: PurchaseItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  grandTotal: number;
  status: string;
  paymentStatus: string;
  supplierName: string;
  createdAt: string;
}

export interface Supplier {
  _id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  contactPerson?: string;
  website?: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalRevenue: number;
  lowStockItems: number;
  expiringSoon: number;
  totalStockValue: number;
  averageProductPrice: number;
  totalUnitsInStock: number;
  totalPurchases: number;
  totalSales: number;
}

// Safe array access helper
const safeArray = (data) => Array.isArray(data) ? data : [];

// Central hook to fetch ALL application data
export const useAppData = () => {
  const { token } = useAuth();

  // Fetch all data in parallel with safe error handling
  const results = useQueries({
    queries: [
      // Inventory
      {
        queryKey: ['app-data', 'inventory'],
        queryFn: async (): Promise<Product[]> => {
          try {
            const res = await api.get('/inventory', { params: { limit: 1000 } });
            return safeArray(res.data?.data);
          } catch (error) {
            console.error('Error fetching inventory:', error);
            return [];
          }
        },
        enabled: !!token,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        placeholderData: (previousData) => safeArray(previousData),
      },
      // Sales
      {
        queryKey: ['app-data', 'sales'],
        queryFn: async (): Promise<Sale[]> => {
          try {
            const res = await api.get('/sales', { params: { limit: 1000, lastDays: 30 } });
            return safeArray(res.data?.data?.sales || res.data?.data);
          } catch (error) {
            console.error('Error fetching sales:', error);
            return [];
          }
        },
        enabled: !!token,
        staleTime: 2 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        placeholderData: (previousData) => safeArray(previousData),
      },
      // Purchases
      {
        queryKey: ['app-data', 'purchases'],
        queryFn: async (): Promise<Purchase[]> => {
          try {
            const res = await api.get('/purchases', { params: { limit: 1000, lastDays: 30 } });
            return safeArray(res.data?.data?.purchases || res.data?.data);
          } catch (error) {
            console.error('Error fetching purchases:', error);
            return [];
          }
        },
        enabled: !!token,
        staleTime: 2 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        placeholderData: (previousData) => safeArray(previousData),
      },
      // Suppliers
      {
        queryKey: ['app-data', 'suppliers'],
        queryFn: async (): Promise<Supplier[]> => {
          try {
            const res = await api.get('/suppliers', { params: { limit: 1000 } });
            return safeArray(res.data?.data?.suppliers || res.data?.data);
          } catch (error) {
            console.error('Error fetching suppliers:', error);
            return [];
          }
        },
        enabled: !!token,
        staleTime: 10 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        placeholderData: (previousData) => safeArray(previousData),
      },
    ],
  });

  // Extract individual query results with safe defaults
  const [
    inventoryQuery,
    salesQuery,
    purchasesQuery,
    suppliersQuery,
  ] = results;

  // Helper to check if any query is loading
  const isLoading = results.some(query => query.isLoading);
  const isFetching = results.some(query => query.isFetching);
  const isError = results.some(query => query.isError);
  const errors = results.map(query => query.error).filter(Boolean);

  // Check if we're showing placeholder data
  const isPreviousData = results.some(query => query.isPlaceholderData);

  // Refresh all data
  const refreshAll = () => {
    results.forEach(query => query.refetch());
  };

  // Invalidate all data (for mutations)
  const invalidateAll = (queryClient) => {
    queryClient.invalidateQueries({ queryKey: ['app-data'] });
  };

  // Safe data access
  const products = safeArray(inventoryQuery.data);
  const sales = safeArray(salesQuery.data);
  const purchases = safeArray(purchasesQuery.data);
  const suppliers = safeArray(suppliersQuery.data);

  return {
    // Data with safe defaults
    products,
    sales,
    purchases,
    suppliers,
    
    // States
    isLoading,
    isFetching,
    isError,
    errors,
    isPreviousData,
    
    // Individual query states
    inventoryQuery,
    salesQuery,
    purchasesQuery,
    suppliersQuery,
    
    // Actions
    refreshAll,
    invalidateAll,
    
    // Individual refetch functions
    refetchInventory: inventoryQuery.refetch,
    refetchSales: salesQuery.refetch,
    refetchPurchases: purchasesQuery.refetch,
    refetchSuppliers: suppliersQuery.refetch,
  };
};

// Individual hooks for specific data
export const useInventoryData = () => {
  const { products, inventoryQuery, refetchInventory } = useAppData();
  return {
    products,
    isLoading: inventoryQuery.isLoading,
    isFetching: inventoryQuery.isFetching,
    isPreviousData: inventoryQuery.isPlaceholderData,
    refetch: refetchInventory,
  };
};

export const useSalesData = () => {
  const { sales, salesQuery, refetchSales } = useAppData();
  return {
    sales,
    isLoading: salesQuery.isLoading,
    isFetching: salesQuery.isFetching,
    isPreviousData: salesQuery.isPlaceholderData,
    refetch: refetchSales,
  };
};

export const usePurchasesData = () => {
  const { purchases, purchasesQuery, refetchPurchases } = useAppData();
  return {
    purchases,
    isLoading: purchasesQuery.isLoading,
    isFetching: purchasesQuery.isFetching,
    isPreviousData: purchasesQuery.isPlaceholderData,
    refetch: refetchPurchases,
  };
};

export const useSuppliersData = () => {
  const { suppliers, suppliersQuery, refetchSuppliers } = useAppData();
  return {
    suppliers,
    isLoading: suppliersQuery.isLoading,
    isFetching: suppliersQuery.isFetching,
    isPreviousData: suppliersQuery.isPlaceholderData,
    refetch: refetchSuppliers,
  };
};

// Safe reduce helper
const safeReduce = (array, callback, initialValue) => {
  if (!Array.isArray(array)) return initialValue;
  return array.reduce(callback, initialValue);
};

// Safe date helper
const safeDateCheck = (dateString) => {
  if (!dateString) return false;
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
};

// Dashboard-specific calculations with safe handling
export const useDashboardData = () => {
  const { products, sales, purchases } = useAppData();
  
  // Ensure arrays are safe
  const safeProducts = safeArray(products);
  const safeSales = safeArray(sales);
  const safePurchases = safeArray(purchases);
  
  const stats = {
    totalProducts: safeProducts.length,
    totalRevenue: safeReduce(safeSales, (sum, sale) => {
      if (!sale || typeof sale !== 'object') return sum;
      return sum + (sale.grandTotal || 0);
    }, 0),
    lowStockItems: safeProducts.filter(item => {
      if (!item || typeof item !== 'object') return false;
      return (item.stock || 0) <= 20;
    }).length,
    expiringSoon: safeProducts.filter(item => {
      if (!item || !item.expiry) return false;
      if (!safeDateCheck(item.expiry)) return false;
      
      const expiryDate = new Date(item.expiry);
      const threeMonthsLater = new Date();
      threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
      const today = new Date();
      
      return expiryDate <= threeMonthsLater && expiryDate >= today;
    }).length,
    totalStockValue: safeReduce(safeProducts, (sum, item) => {
      if (!item || typeof item !== 'object') return sum;
      const costPrice = item.costPrice || item.price || 0;
      const stock = item.stock || 0;
      return sum + (costPrice * stock);
    }, 0),
    averageProductPrice: safeProducts.length > 0 
      ? safeReduce(safeProducts, (sum, item) => {
          if (!item || typeof item !== 'object') return sum;
          return sum + (item.salePrice || item.price || 0);
        }, 0) / safeProducts.length 
      : 0,
    totalUnitsInStock: safeReduce(safeProducts, (sum, item) => {
      if (!item || typeof item !== 'object') return sum;
      return sum + (item.stock || 0);
    }, 0),
    totalPurchases: safePurchases.length,
    totalSales: safeSales.length,
  };

  return { 
    stats, 
    products: safeProducts, 
    sales: safeSales, 
    purchases: safePurchases 
  };
};

// Reports-specific data calculations with safe handling
export const useReportsData = () => {
  const { products, sales, purchases } = useAppData();
  
  // Ensure arrays are safe
  const safeProducts = safeArray(products);
  const safeSales = safeArray(sales);
  const safePurchases = safeArray(purchases);

  // Calculate dashboard stats
  const dashboardStats = useMemo(() => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Today's sales
    const todaySales = safeSales.filter(sale => {
      if (!sale || !sale.createdAt) return false;
      const saleDate = new Date(sale.createdAt);
      return saleDate >= startOfDay;
    });
    const todayRevenue = safeReduce(todaySales, (sum, sale) => sum + (sale.grandTotal || 0), 0);

    // This month's sales
    const monthSales = safeSales.filter(sale => {
      if (!sale || !sale.createdAt) return false;
      const saleDate = new Date(sale.createdAt);
      return saleDate >= startOfMonth;
    });
    const monthRevenue = safeReduce(monthSales, (sum, sale) => sum + (sale.grandTotal || 0), 0);

    // Low stock items
    const lowStockItems = safeProducts
      .filter(item => (item.stock || 0) < 20)
      .map(item => ({
        id: item._id || Math.random().toString(),
        name: item.name || 'Unknown Product',
        stock: item.stock || 0,
        category: item.category || 'Uncategorized',
        costPrice: item.costPrice || 0
      }))
      .slice(0, 5);

    // Expiring soon items
    const expiringItems = safeProducts
      .filter(item => {
        if (!item || !item.expiry) return false;
        try {
          const expiryDate = new Date(item.expiry);
          return expiryDate <= thirtyDaysFromNow && expiryDate > new Date();
        } catch {
          return false;
        }
      })
      .map(item => ({
        id: item._id || Math.random().toString(),
        name: item.name || 'Unknown Product',
        expiry: item.expiry,
        stock: item.stock || 0,
        daysUntilExpiry: Math.ceil((new Date(item.expiry) - new Date()) / (1000 * 60 * 60 * 24))
      }))
      .slice(0, 5);

    // Inventory value
    const inventoryValue = safeReduce(safeProducts, (sum, item) => {
      return sum + ((item.stock || 0) * (item.costPrice || 0));
    }, 0);

    return {
      quickStats: {
        todayRevenue,
        todayTransactions: todaySales.length,
        monthRevenue,
        lowStockCount: lowStockItems.length,
        expiringCount: expiringItems.length
      },
      lowStockItems,
      expiringItems,
      inventorySummary: {
        totalItems: safeProducts.length,
        totalStock: safeReduce(safeProducts, (sum, item) => sum + (item.stock || 0), 0),
        totalValue: inventoryValue
      }
    };
  }, [safeProducts, safeSales]);

  // Sales report calculations
  const salesReport = useMemo(() => {
    const totalSales = safeReduce(safeSales, (sum, sale) => sum + (sale.grandTotal || 0), 0);
    const totalItems = safeReduce(safeSales, (sum, sale) => {
      if (!sale.items || !Array.isArray(sale.items)) return sum;
      return sum + safeReduce(sale.items, (itemSum, item) => itemSum + (item.quantity || 0), 0);
    }, 0);

    // Top selling products
    const productSales = {};
    safeSales.forEach(sale => {
      if (!sale.items || !Array.isArray(sale.items)) return;
      
      sale.items.forEach(item => {
        if (!item || !item.productName) return;
        
        const productName = item.productName;
        if (!productSales[productName]) {
          productSales[productName] = {
            quantity: 0,
            revenue: 0
          };
        }
        productSales[productName].quantity += item.quantity || 0;
        productSales[productName].revenue += item.total || 0;
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([name, data]) => ({
        _id: name,
        totalQuantity: data.quantity,
        totalRevenue: data.revenue
      }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10);

    // Recent sales
    const recentSales = [...safeSales]
      .filter(s => s && s.createdAt)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    return {
      summary: {
        totalSales,
        totalItems,
        totalTransactions: safeSales.length,
        averageTransactionValue: safeSales.length > 0 ? totalSales / safeSales.length : 0
      },
      topProducts,
      recentSales
    };
  }, [safeSales]);

  // Inventory report calculations
  const inventoryReport = useMemo(() => {
    const totalValue = safeReduce(safeProducts, (sum, item) => 
      sum + ((item.stock || 0) * (item.costPrice || 0)), 0);
    const totalStock = safeReduce(safeProducts, (sum, item) => sum + (item.stock || 0), 0);
    
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Low stock items
    const lowStockItems = safeProducts
      .filter(item => (item.stock || 0) < 20)
      .map(item => ({
        id: item._id || Math.random().toString(),
        name: item.name || 'Unknown Product',
        stock: item.stock || 0,
        category: item.category || 'Uncategorized',
        costPrice: item.costPrice || 0
      }));

    // Expiring soon items
    const expiringItems = safeProducts
      .filter(item => {
        if (!item || !item.expiry) return false;
        try {
          const expiryDate = new Date(item.expiry);
          return expiryDate <= thirtyDaysFromNow && expiryDate > today;
        } catch {
          return false;
        }
      })
      .map(item => {
        let daysUntilExpiry = 0;
        try {
          const expiryDate = new Date(item.expiry);
          daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        } catch {
          daysUntilExpiry = 0;
        }
        
        return {
          id: item._id || Math.random().toString(),
          name: item.name || 'Unknown Product',
          expiry: item.expiry,
          stock: item.stock || 0,
          daysUntilExpiry
        };
      });

    return {
      summary: {
        totalItems: safeProducts.length,
        totalStock,
        totalValue,
        averageStockValue: safeProducts.length > 0 ? totalValue / safeProducts.length : 0
      },
      lowStockItems,
      expiringItems
    };
  }, [safeProducts]);

  // Purchases report calculations
  const purchasesReport = useMemo(() => {
    const totalSpent = safeReduce(safePurchases, (sum, purchase) => {
      if (!purchase || typeof purchase !== 'object') return sum;
      return sum + (purchase.grandTotal || 0);
    }, 0);
    
    const totalItems = safeReduce(safePurchases, (sum, purchase) => {
      if (!purchase || !purchase.items || !Array.isArray(purchase.items)) return sum;
      return sum + safeReduce(purchase.items, (itemSum, item) => {
        if (!item) return itemSum;
        return itemSum + (item.quantity || 0);
      }, 0);
    }, 0);

    // Status distribution with safe checks
    const statusDistribution = {
      pending: safePurchases.filter(p => p && p.status === 'Pending').length,
      received: safePurchases.filter(p => p && p.status === 'Received').length,
      cancelled: safePurchases.filter(p => p && p.status === 'Cancelled').length,
      partial: safePurchases.filter(p => p && p.status === 'Partial').length
    };

    // Recent purchases with safe sorting
    const recentPurchases = [...safePurchases]
      .filter(p => p && (p.purchaseDate || p.createdAt))
      .sort((a, b) => {
        const dateA = new Date(a.purchaseDate || a.createdAt);
        const dateB = new Date(b.purchaseDate || b.createdAt);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 10);

    return {
      summary: {
        totalSpent,
        totalItems,
        totalPurchases: safePurchases.length,
        averagePurchaseValue: safePurchases.length > 0 ? totalSpent / safePurchases.length : 0
      },
      recentPurchases,
      statusDistribution
    };
  }, [safePurchases]);

  // Financial report calculations
  const financialReport = useMemo(() => {
    const totalRevenue = safeReduce(safeSales, (sum, sale) => {
      if (!sale || typeof sale !== 'object') return sum;
      return sum + (sale.grandTotal || 0);
    }, 0);
    
    const totalCost = safeReduce(safePurchases, (sum, purchase) => {
      if (!purchase || typeof purchase !== 'object') return sum;
      return sum + (purchase.grandTotal || 0);
    }, 0);
    
    const inventoryValue = safeReduce(safeProducts, (sum, item) => {
      if (!item || typeof item !== 'object') return sum;
      const stock = item.stock || 0;
      const costPrice = item.costPrice || 0;
      return sum + (stock * costPrice);
    }, 0);

    const grossProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    return {
      summary: {
        totalRevenue,
        totalCost,
        grossProfit,
        profitMargin: parseFloat(profitMargin.toFixed(2)),
        inventoryValue,
        netCashFlow: grossProfit
      },
      keyMetrics: {
        totalTransactions: safeSales.length,
        totalPurchases: safePurchases.length,
        totalInventoryItems: safeProducts.length
      }
    };
  }, [safeSales, safePurchases, safeProducts]);

  return {
    dashboard: dashboardStats,
    sales: salesReport,
    inventory: inventoryReport,
    purchases: purchasesReport,
    financial: financialReport
  };
};

// Custom hook for specific report data
export const useReportData = (type = 'dashboard') => {
  const reportsData = useReportsData();
  const { isLoading, isFetching, isPreviousData, refreshAll } = useAppData();

  // Get data with safe fallback
  const getSafeData = () => {
    if (!reportsData || typeof reportsData !== 'object') {
      return getEmptyReport(type);
    }
    return reportsData[type] || getEmptyReport(type);
  };

  return {
    data: getSafeData(),
    isLoading,
    isFetching,
    isPreviousData,
    refetch: refreshAll
  };
};

// Helper function for empty report data
const getEmptyReport = (type) => {
  const emptySummary = {
    totalItems: 0,
    totalStock: 0,
    totalValue: 0,
    averageStockValue: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalCost: 0,
    grossProfit: 0,
    profitMargin: 0,
    inventoryValue: 0,
    netCashFlow: 0,
    totalSpent: 0,
    totalPurchases: 0,
    averagePurchaseValue: 0,
    totalTransactions: 0,
    averageTransactionValue: 0
  };

  switch (type) {
    case 'dashboard':
      return {
        quickStats: {
          todayRevenue: 0,
          todayTransactions: 0,
          monthRevenue: 0,
          lowStockCount: 0,
          expiringCount: 0
        },
        lowStockItems: [],
        expiringItems: [],
        inventorySummary: {
          totalItems: 0,
          totalStock: 0,
          totalValue: 0
        }
      };
    case 'sales':
      return {
        summary: emptySummary,
        topProducts: [],
        recentSales: []
      };
    case 'inventory':
      return {
        summary: emptySummary,
        lowStockItems: [],
        expiringItems: []
      };
    case 'purchases':
      return {
        summary: emptySummary,
        recentPurchases: [],
        statusDistribution: {
          pending: 0,
          received: 0,
          cancelled: 0,
          partial: 0
        }
      };
    case 'financial':
      return {
        summary: emptySummary,
        keyMetrics: {
          totalTransactions: 0,
          totalPurchases: 0,
          totalInventoryItems: 0
        }
      };
    default:
      return {};
  }
};

// Helper function for memoization (add this at the top if missing)
import { useMemo } from 'react';
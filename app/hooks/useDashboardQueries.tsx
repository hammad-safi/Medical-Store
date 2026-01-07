import { useQueries } from '@tanstack/react-query';
import api from '@/app/lib/axios';

// Dashboard data types
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
  inventoryId?: {
    category: string;
  };
}

export interface Sale {
  _id: string;
  invoiceNumber: string;
  items: SaleItem[];
  grandTotal: number;
  createdAt: string;
}

export interface Purchase {
  _id: string;
  invoiceNumber: string;
  supplierName: string;
  grandTotal: number;
  createdAt: string;
}

// Parallel fetching of all dashboard data
export const useDashboardData = (token: string | null) => {
  return useQueries({
    queries: [
      {
        queryKey: ['dashboard', 'inventory'],
        queryFn: async () => {
          const res = await api.get("/inventory", { 
            params: { limit: 1000 } 
          });
          return res.data.data || [];
        },
        enabled: !!token,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes cache
      },
      {
        queryKey: ['dashboard', 'sales'],
        queryFn: async () => {
          const res = await api.get("/sales", { 
            params: { limit: 1000, lastDays: 30 } 
          });
          return res.data.data?.sales || [];
        },
        enabled: !!token,
        staleTime: 2 * 60 * 1000, // 2 minutes
      },
      {
        queryKey: ['dashboard', 'purchases'],
        queryFn: async () => {
          const res = await api.get("/purchases", { 
            params: { limit: 1000, lastDays: 30 } 
          });
          return res.data.data?.purchases || [];
        },
        enabled: !!token,
        staleTime: 2 * 60 * 1000,
      },
    ],
  });
};
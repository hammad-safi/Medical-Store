import { Product, Sale, Purchase } from '@/app/hooks/useDashboardQueries';

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
  profitMargin: number;
}

export interface TopProduct {
  name: string;
  category: string;
  salesCount: number;
  revenue: number;
}

export interface AlertProduct {
  id: string;
  name: string;
  category: string;
  stock: number;
  salePrice: number;
  expiryDate?: string;
  reorderLevel?: number;
}

// Calculate all statistics
export const calculateDashboardStats = (
  products: Product[],
  sales: Sale[],
  purchases: Purchase[]
): DashboardStats => {
  const totalProducts = products.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + (sale.grandTotal || 0), 0);
  
  const lowStockItems = products.filter(item => (item.stock || 0) <= 20).length;
  
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
  const expiringSoon = products.filter(item => {
    if (!item.expiry) return false;
    const expiryDate = new Date(item.expiry);
    return expiryDate <= threeMonthsLater && expiryDate >= new Date();
  }).length;
  
  const totalStockValue = products.reduce((sum, item) => {
    const costPrice = item.costPrice || item.price || 0;
    const stock = item.stock || 0;
    return sum + (costPrice * stock);
  }, 0);
  
  const averageProductPrice = products.length > 0 
    ? products.reduce((sum, item) => sum + (item.salePrice || item.price || 0), 0) / products.length 
    : 0;
  
  const totalUnitsInStock = products.reduce((sum, item) => sum + (item.stock || 0), 0);
  const totalPurchases = purchases.length;
  const totalSales = sales.length;
  
  // Calculate profit margin (estimated based on 70% cost of goods)
  const estimatedCostOfGoods = totalStockValue * 0.7;
  const profitMargin = totalRevenue > 0 
    ? ((totalRevenue - estimatedCostOfGoods) / totalRevenue * 100)
    : 0;

  return {
    totalProducts,
    totalRevenue,
    lowStockItems,
    expiringSoon,
    totalStockValue,
    averageProductPrice,
    totalUnitsInStock,
    totalPurchases,
    totalSales,
    profitMargin
  };
};

// Calculate top selling products
export const calculateTopProducts = (sales: Sale[]): TopProduct[] => {
  const productSalesMap: Record<string, TopProduct> = {};
  
  sales.forEach(sale => {
    if (sale.items && Array.isArray(sale.items)) {
      sale.items.forEach(item => {
        const productName = item.productName;
        if (!productSalesMap[productName]) {
          productSalesMap[productName] = {
            name: productName,
            category: item.inventoryId?.category || 'Unknown',
            salesCount: 0,
            revenue: 0
          };
        }
        productSalesMap[productName].salesCount += item.quantity || 1;
        productSalesMap[productName].revenue += item.total || item.unitPrice || 0;
      });
    }
  });
  
  return Object.values(productSalesMap)
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5);
};

// Calculate low stock products
export const calculateLowStockProducts = (products: Product[]): AlertProduct[] => {
  const REORDER_LEVEL = 20;
  
  return products
    .filter(item => (item.stock || 0) <= REORDER_LEVEL)
    .map(item => ({
      id: item._id,
      name: item.name,
      category: item.category,
      stock: item.stock || 0,
      salePrice: item.salePrice || item.price || 0,
      reorderLevel: REORDER_LEVEL
    }));
};

// Calculate expiring products
export const calculateExpiringProducts = (products: Product[]): AlertProduct[] => {
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
  
  return products
    .filter(item => {
      if (!item.expiry) return false;
      const expiryDate = new Date(item.expiry);
      return expiryDate <= threeMonthsLater && expiryDate >= new Date();
    })
    .map(item => ({
      id: item._id,
      name: item.name,
      category: item.category,
      stock: item.stock || 0,
      salePrice: item.salePrice || item.price || 0,
      expiryDate: item.expiry
    }));
};
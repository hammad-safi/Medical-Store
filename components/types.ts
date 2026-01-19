export interface Product {
  _id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  expiry: string;
}
export interface User {
  _id: string;
  userName: string;
  fullName: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  category: string;
  stock: number;
  costPrice: number;
  salePrice: number;
  expiry: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Supplier {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Purchase {
  _id: string;
  productId: Product;
  supplierId: Supplier;
  quantity: number;
  costPrice: number;
  salePrice: number;
  invoiceNumber: string;
  expiry: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  _id: string;
  invoiceNumber: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paymentMethod: string;
  customerName: string;
  customerPhone?: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ToastType {
  message: string;
  type: "success" | "error" | "info" | "warning";
}

export interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
}
export interface ToastType {
  message: string;
  type: "success" | "error" | "info" | "warning";
}
export interface Product {
  _id: string;
  name: string;
  category: string;
  stock: number;
  costPrice: number;
  salePrice: number;
  expiry: string;
}

export interface Supplier {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface Purchase {
  _id: string;
  productId: Product;
  supplierId: Supplier;
  quantity: number;
  costPrice: number;
  salePrice: number;
  invoiceNumber: string;
  expiry: string;
  createdAt: string;
}

export interface Sale {
  _id: string;
  productId: string;
  quantity: number;
  sellingPrice: number;
  totalPrice: number;
  customerName: string;
  createdAt: string;
}

export interface ToastType {
  message: string;
  type: "success" | "error" | "info" | "warning";
}
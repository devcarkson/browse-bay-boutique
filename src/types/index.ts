import { Product } from './product.types';

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

export interface CartItem {
  id?: string | number; // Add id for backend sync
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  shippingAddress: Address;
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface FilterOptions {
  searchTerm: string;
  category: string | number; // Accept both string and number
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
}

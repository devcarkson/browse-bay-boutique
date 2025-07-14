
import apiClient from './client';
import { Product, ProductListResponse } from '@/types/product.types';

export const ProductService = {
  getProducts: async (params?: Record<string, any>): Promise<ProductListResponse> => {
    const { data } = await apiClient.get('/products/', { params });
    return data;
  },
  
  getFeaturedProducts: async (): Promise<Product[]> => {
    const { data } = await apiClient.get('/products/featured/');
    return data.results || data;
  },

  getProduct: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get(`/products/${id}/`);
    return data;
  }
};

import apiClient from './client';
// import apiClient from './client';
import { Product, ProductListResponse } from '@/types/product.types';

export const ProductService = {
  getProducts: async (params?: Record<string, any>): Promise<ProductListResponse> => {
    const { data } = await apiClient.get('/products/', { params });
    return data;
  },
  
  getFeaturedProducts: async (): Promise<Product[]> => {
    const { data } = await apiClient.get('/products/featured/');
    return data.results;
  }
};

import apiClient from './client';
import { Product, ProductListResponse } from '@/types/product.types';

export const ProductService = {
  getProducts: async (params?: Record<string, any>): Promise<ProductListResponse> => {
    const { data } = await apiClient.get('/products/', { params });
    return data;
  },
  
  getFeaturedProducts: async (): Promise<Product[]> => {
    try {
      // Try the featured endpoint first
      const { data } = await apiClient.get('/products/featured/');
      return data.results || data;
    } catch (error) {
      console.log('Featured endpoint failed, trying with featured=true param');
      // Fallback to filtering products by featured=true
      const { data } = await apiClient.get('/products/', { params: { featured: true } });
      return data.results || [];
    }
  },

  getProduct: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get(`/products/${id}/`);
    return data;
  }
};

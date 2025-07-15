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
      const { data } = await apiClient.get('/products/', { params: { featured: true } });
      return data.results || [];
    }
  },

  getNewArrivalProducts: async (): Promise<Product[]> => {
    try {
      const { data } = await apiClient.get('/products/new_arrival/');
      return data.results || data;
    } catch (error) {
      console.log('New arrival endpoint failed, trying with is_new_arrival=true param');
      const { data } = await apiClient.get('/products/', { params: { is_new_arrival: true } });
      return data.results || [];
    }
  },

  getProduct: async (id: string): Promise<Product> => {
    const { data } = await apiClient.get(`/products/${id}/`);
    return data;
  }
};

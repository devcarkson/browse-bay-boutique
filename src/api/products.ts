import apiClient from './client';
import { Product, ProductListResponse } from '@/types/product.types';

export const getProductReviews = async (slug: string) => {
  const { data } = await apiClient.get(`/products/${slug}/reviews/`);
  return data;
};

export const postProductReview = async (slug: string, review: { rating: number; comment: string }, token: string) => {
  const { data } = await apiClient.post(
    `/products/${slug}/reviews/`,
    review,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const ProductService = {
  getProducts: async (params?: Record<string, any>): Promise<ProductListResponse> => {
    console.log('Fetching products with params:', params);
    const { data } = await apiClient.get('/products/', { params });
    return data;
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    console.log('Fetching featured products...');
    
    try {
      // Try the featured endpoint first
      console.log('Trying /products/featured/ endpoint');
      const { data } = await apiClient.get('/products/featured/');
      console.log('Featured endpoint response:', data);
      return Array.isArray(data) ? data : (data.results || []);
    } catch (error: any) {
      console.log('Featured endpoint failed:', error.response?.status, error.message);
      
      try {
        console.log('Trying /products/ with featured=true param');
        const { data } = await apiClient.get('/products/', { params: { featured: true } });
        console.log('Featured param response:', data);
        return Array.isArray(data) ? data : (data.results || []);
      } catch (secondError: any) {
        console.log('Featured param failed:', secondError.response?.status, secondError.message);
        
        try {
          console.log('Trying /products/ with is_featured=true param');
          const { data } = await apiClient.get('/products/', { params: { is_featured: true } });
          console.log('is_featured param response:', data);
          return Array.isArray(data) ? data : (data.results || []);
        } catch (thirdError: any) {
          console.error('All featured product endpoints failed:', {
            status: thirdError.response?.status,
            message: thirdError.message,
            data: thirdError.response?.data
          });
          throw thirdError; // Let React Query handle the error and show fallback
        }
      }
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

// src/hooks/useProducts.ts
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Product } from '@/types/product.types';
import { PaginatedResponse } from '@/types';
import { ProductService } from '@/api/products';

// Infinite scroll products hook
export const useProductsInfinite = (params?: Record<string, unknown>) => {
  return useInfiniteQuery<PaginatedResponse<Product>, AxiosError>({
    queryKey: ['products', params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await ProductService.getProducts({
        ...params,
        page: pageParam,
      });
      return response;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next);
      const nextPage = url.searchParams.get('page');
      return nextPage ? Number(nextPage) : undefined;
    },
    initialPageParam: 1,
    retry: (failureCount, error) => {
      // Don't retry on 500 errors, but retry on network errors
      if (error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000,
    staleTime: 2 * 60 * 1000, // 2 minutes cache
  });
};

// Regular products hook (non-infinite)
export const useProducts = (params?: Record<string, unknown>) => {
  return useQuery<PaginatedResponse<Product>, AxiosError>({
    queryKey: ['products', params],
    queryFn: () => ProductService.getProducts(params),
    retry: (failureCount, error) => {
      // Don't retry on 500 errors, but retry on network errors
      if (error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000,
    staleTime: 2 * 60 * 1000, // 2 minutes cache
  });
};

// Featured products hook
export const useFeaturedProducts = () => {
  return useQuery<Product[], AxiosError>({
    queryKey: ['featured-products'],
    queryFn: ProductService.getFeaturedProducts,
    retry: (failureCount, error) => {
      // Don't retry on 500 errors, but retry on network errors
      if (error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
  });
};

// New arrival products hook
export const useNewArrivalProducts = () => {
  return useQuery<Product[], AxiosError>({
    queryKey: ['new-arrival-products'],
    queryFn: ProductService.getNewArrivalProducts,
    retry: (failureCount, error) => {
      // Don't retry on 500 errors, but retry on network errors
      if (error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
  });
};

// Single product hook
export const useProduct = (slug: string) => {
  return useQuery<Product, AxiosError>({
    queryKey: ['product', slug],
    queryFn: () => ProductService.getProduct(slug),
    retry: (failureCount, error) => {
      // Don't retry on 500 errors, but retry on network errors
      if (error.response?.status === 500) return false;
      return failureCount < 2;
    },
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
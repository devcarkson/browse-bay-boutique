
import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/api/products';

export const useProducts = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => ProductService.getProducts(params),
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['featured-products'],
    queryFn: () => ProductService.getFeaturedProducts(),
  });
};

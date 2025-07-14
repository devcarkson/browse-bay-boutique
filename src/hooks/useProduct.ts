
import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/api/products';

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => ProductService.getProduct(id),
    enabled: !!id,
  });
};

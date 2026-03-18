import { useQuery } from "@tanstack/react-query";

import { productQueryKeys } from "@/src/features/products/queries/query-keys";
import { productRepository } from "@/src/features/products/repository/ProductRepository";
import type { ProductFilters } from "@/src/features/products/types/product.types";

export const useProductsQuery = (productFilters: ProductFilters = {}) => {
  return useQuery({
    queryKey: productQueryKeys.list(productFilters),
    queryFn: () => productRepository.list(productFilters),
  });
};

export const useProductQuery = (productId: string) => {
  return useQuery({
    queryKey: productQueryKeys.detail(productId),
    queryFn: () => productRepository.getById(productId),
    enabled: productId.trim().length > 0,
  });
};

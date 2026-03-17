import { useQuery } from "@tanstack/react-query";

import { productQueryKeys } from "@/src/domain/products/query-keys";
import { getProductById, listProducts } from "@/src/domain/products/use-cases";
import type { ProductFilters } from "@/src/domain/products/types";

export const useProductsQuery = (productFilters: ProductFilters = {}) => {
  return useQuery({
    queryKey: productQueryKeys.list(productFilters),
    queryFn: () => listProducts(productFilters),
  });
};

export const useProductQuery = (productId: string) => {
  return useQuery({
    queryKey: productQueryKeys.detail(productId),
    queryFn: () => getProductById(productId),
    enabled: productId.trim().length > 0,
  });
};

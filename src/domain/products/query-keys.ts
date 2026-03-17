import type { ProductFilters } from "@/src/domain/products/types";

const makeListFilterKey = (productFilters: ProductFilters) => {
  return {
    storeId: productFilters.storeId ?? "all",
  };
};

export const productQueryKeys = {
  all: ["products"] as const,
  lists: () => [...productQueryKeys.all, "list"] as const,
  list: (productFilters: ProductFilters) =>
    [...productQueryKeys.lists(), makeListFilterKey(productFilters)] as const,
  details: () => [...productQueryKeys.all, "detail"] as const,
  detail: (productId: string) => [...productQueryKeys.details(), productId] as const,
};

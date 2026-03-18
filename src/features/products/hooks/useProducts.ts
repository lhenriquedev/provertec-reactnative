import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "@/src/features/products/queries/mutations";
import {
  useProductQuery,
  useProductsQuery,
} from "@/src/features/products/queries/queries";
import type { ProductFilters } from "@/src/features/products/types/product.types";

export const useProducts = (productFilters: ProductFilters = {}) => {
  return {
    productsQuery: useProductsQuery(productFilters),
    createProductMutation: useCreateProductMutation(),
    updateProductMutation: useUpdateProductMutation(),
    deleteProductMutation: useDeleteProductMutation(),
  };
};

export const useProductDetails = (productId: string) => {
  return useProductQuery(productId);
};

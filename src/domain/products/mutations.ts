import { useMutation, useQueryClient } from "@tanstack/react-query";

import { productQueryKeys } from "@/src/domain/products/query-keys";
import { createProduct, deleteProduct, updateProduct } from "@/src/domain/products/use-cases";
import type { ProductInput, ProductUpdateInput } from "@/src/domain/products/types";

type UpdateProductVariables = {
  productId: string;
  productInput: ProductUpdateInput;
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productInput: ProductInput) => createProduct(productInput),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, productInput }: UpdateProductVariables) => {
      return updateProduct(productId, productInput);
    },
    onSuccess: (_updatedProduct, variables) => {
      void queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
      void queryClient.invalidateQueries({
        queryKey: productQueryKeys.detail(variables.productId),
      });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
    },
  });
};

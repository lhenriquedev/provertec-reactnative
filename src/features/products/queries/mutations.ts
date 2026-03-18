import { useMutation, useQueryClient } from "@tanstack/react-query";

import { productQueryKeys } from "@/src/features/products/queries/query-keys";
import { productRepository } from "@/src/features/products/repository/ProductRepository";
import type {
  ProductInput,
  ProductUpdateInput,
} from "@/src/features/products/types/product.types";

type UpdateProductVariables = {
  productId: string;
  productInput: ProductUpdateInput;
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productInput: ProductInput) => productRepository.create(productInput),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, productInput }: UpdateProductVariables) => {
      return productRepository.update(productId, productInput);
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
    mutationFn: (productId: string) => productRepository.delete(productId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
    },
  });
};

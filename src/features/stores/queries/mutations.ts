import { useMutation, useQueryClient } from "@tanstack/react-query";

import { storeQueryKeys } from "@/src/features/stores/queries/query-keys";
import { storeRepository } from "@/src/features/stores/repository/StoreRepository";
import type { StoreInput } from "@/src/features/stores/types/store.types";

type UpdateStoreVariables = {
  storeId: string;
  storeInput: StoreInput;
};

export const useCreateStoreMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (storeInput: StoreInput) => storeRepository.create(storeInput),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: storeQueryKeys.all });
    },
  });
};

export const useUpdateStoreMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, storeInput }: UpdateStoreVariables) => {
      return storeRepository.update(storeId, storeInput);
    },
    onSuccess: (_updatedStore, variables) => {
      void queryClient.invalidateQueries({ queryKey: storeQueryKeys.all });
      void queryClient.invalidateQueries({
        queryKey: storeQueryKeys.detail(variables.storeId),
      });
    },
  });
};

export const useDeleteStoreMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (storeId: string) => storeRepository.delete(storeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: storeQueryKeys.all });
    },
  });
};

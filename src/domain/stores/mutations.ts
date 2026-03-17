import { useMutation, useQueryClient } from "@tanstack/react-query";

import { storeQueryKeys } from "@/src/domain/stores/query-keys";
import type { StoreInput } from "@/src/domain/stores/types";
import {
  createStore,
  deleteStore,
  updateStore,
} from "@/src/domain/stores/use-cases";

type UpdateStoreVariables = {
  storeId: string;
  storeInput: StoreInput;
};

export const useCreateStoreMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.all });
    },
  });
};

export const useUpdateStoreMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ storeId, storeInput }: UpdateStoreVariables) => {
      return updateStore(storeId, storeInput);
    },
    onSuccess: (_updatedStore, variables) => {
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: storeQueryKeys.detail(variables.storeId),
      });
    },
  });
};

export const useDeleteStoreMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storeQueryKeys.all });
    },
  });
};

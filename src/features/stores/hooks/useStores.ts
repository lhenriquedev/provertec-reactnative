import {
  useCreateStoreMutation,
  useDeleteStoreMutation,
  useUpdateStoreMutation,
} from "@/src/features/stores/queries/mutations";
import { useStoreQuery, useStoresQuery } from "@/src/features/stores/queries/queries";

export const useStores = () => {
  return {
    storesQuery: useStoresQuery(),
    createStoreMutation: useCreateStoreMutation(),
    updateStoreMutation: useUpdateStoreMutation(),
    deleteStoreMutation: useDeleteStoreMutation(),
  };
};

export const useStoreDetails = (storeId: string) => {
  return useStoreQuery(storeId);
};

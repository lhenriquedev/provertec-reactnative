import { useQuery } from "@tanstack/react-query";

import { storeQueryKeys } from "@/src/features/stores/queries/query-keys";
import { storeRepository } from "@/src/features/stores/repository/StoreRepository";

export const useStoresQuery = () => {
  return useQuery({
    queryKey: storeQueryKeys.list(),
    queryFn: () => storeRepository.list(),
  });
};

export const useStoreQuery = (storeId: string) => {
  return useQuery({
    queryKey: storeQueryKeys.detail(storeId),
    queryFn: () => storeRepository.getById(storeId),
    enabled: storeId.trim().length > 0,
  });
};

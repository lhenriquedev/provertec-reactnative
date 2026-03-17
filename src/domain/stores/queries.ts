import { useQuery } from "@tanstack/react-query";

import { storeQueryKeys } from "@/src/domain/stores/query-keys";
import { getStoreById, listStores } from "@/src/domain/stores/use-cases";

export const useStoresQuery = () => {
  return useQuery({
    queryKey: storeQueryKeys.list(),
    queryFn: listStores,
  });
};

export const useStoreQuery = (storeId: string) => {
  return useQuery({
    queryKey: storeQueryKeys.detail(storeId),
    queryFn: () => getStoreById(storeId),
    enabled: storeId.trim().length > 0,
  });
};

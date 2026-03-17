export const storeQueryKeys = {
  all: ["stores"] as const,
  lists: () => [...storeQueryKeys.all, "list"] as const,
  list: () => [...storeQueryKeys.lists()] as const,
  details: () => [...storeQueryKeys.all, "detail"] as const,
  detail: (storeId: string) => [...storeQueryKeys.details(), storeId] as const,
};

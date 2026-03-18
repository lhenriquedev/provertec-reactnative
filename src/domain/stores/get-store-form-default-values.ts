import type { StoreInput } from "@/src/domain/stores/types";

type StoreFormSource = Partial<Pick<StoreInput, "name" | "address">>;

export const getStoreFormDefaultValues = (
  store?: StoreFormSource | null
): StoreInput => {
  if (!store) {
    return {
      name: "",
      address: "",
    };
  }

  return {
    name: store.name ?? "",
    address: store.address ?? "",
  };
};

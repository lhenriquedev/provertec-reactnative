import type { Store, StoreInput } from "@/src/features/stores/types/store.types";

export interface IStoreRepository {
  list(): Promise<Store[]>;
  getById(storeId: string): Promise<Store>;
  create(storeInput: StoreInput): Promise<Store>;
  update(storeId: string, storeInput: StoreInput): Promise<Store>;
  delete(storeId: string): Promise<void>;
}

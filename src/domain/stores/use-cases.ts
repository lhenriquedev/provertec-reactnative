import { mapStoreDtoToStore, mapStoreInputToPayload } from "@/src/domain/stores/adapters";
import {
  createStoreRequest,
  deleteStoreRequest,
  getStoreRequest,
  listStoresRequest,
  updateStoreRequest,
} from "@/src/domain/stores/service";
import type { Store, StoreInput } from "@/src/domain/stores/types";

export const listStores = async (): Promise<Store[]> => {
  const response = await listStoresRequest();
  return response.stores.map(mapStoreDtoToStore);
};

export const getStoreById = async (storeId: string): Promise<Store> => {
  const response = await getStoreRequest(storeId);
  return mapStoreDtoToStore(response.store);
};

export const createStore = async (storeInput: StoreInput): Promise<Store> => {
  const response = await createStoreRequest(mapStoreInputToPayload(storeInput));
  return mapStoreDtoToStore(response.store);
};

export const updateStore = async (
  storeId: string,
  storeInput: StoreInput
): Promise<Store> => {
  const response = await updateStoreRequest(
    storeId,
    mapStoreInputToPayload(storeInput)
  );

  return mapStoreDtoToStore(response.store);
};

export const deleteStore = async (storeId: string): Promise<void> => {
  await deleteStoreRequest(storeId);
};

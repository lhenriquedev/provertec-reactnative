import {
  mapStoreDtoToStore,
  mapStoreInputToPayload,
} from "@/src/features/stores/adapters/StoreAdapter";
import type { IStoreRepository } from "@/src/features/stores/repository/IStoreRepository";
import type { Store, StoreInput } from "@/src/features/stores/types/store.types";

import {
  createStoreRequest,
  deleteStoreRequest,
  getStoreRequest,
  listStoresRequest,
  updateStoreRequest,
} from "@/src/domain/stores/service";

export class StoreRepository implements IStoreRepository {
  async list(): Promise<Store[]> {
    const response = await listStoresRequest();
    return response.stores.map(mapStoreDtoToStore);
  }

  async getById(storeId: string): Promise<Store> {
    const response = await getStoreRequest(storeId);
    return mapStoreDtoToStore(response.store);
  }

  async create(storeInput: StoreInput): Promise<Store> {
    const response = await createStoreRequest(mapStoreInputToPayload(storeInput));
    return mapStoreDtoToStore(response.store);
  }

  async update(storeId: string, storeInput: StoreInput): Promise<Store> {
    const response = await updateStoreRequest(
      storeId,
      mapStoreInputToPayload(storeInput)
    );

    return mapStoreDtoToStore(response.store);
  }

  async delete(storeId: string): Promise<void> {
    await deleteStoreRequest(storeId);
  }
}

export const storeRepository = new StoreRepository();

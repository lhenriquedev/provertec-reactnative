import type { Store, StoreDto, StoreInput } from "@/src/domain/stores/types";

export const mapStoreDtoToStore = (storeDto: StoreDto): Store => {
  return {
    id: storeDto.id,
    name: storeDto.name,
    address: storeDto.address,
    productsCount: storeDto.productsCount,
  };
};

export const mapStoreInputToPayload = (storeInput: StoreInput): StoreInput => {
  return {
    name: storeInput.name.trim(),
    address: storeInput.address.trim(),
  };
};

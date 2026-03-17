import { storeDetailResponseDtoSchema, storeInputSchema, storeListResponseDtoSchema } from "@/src/domain/stores/schemas";
import type { StoreDetailResponseDto, StoreInput, StoreListResponseDto } from "@/src/domain/stores/types";
import { apiClient } from "@/src/infra/http/api-client";
import { normalizeHttpError } from "@/src/infra/http/errors";

export const listStoresRequest = async (): Promise<StoreListResponseDto> => {
  try {
    const response = await apiClient.get("/stores");
    return storeListResponseDtoSchema.parse(response.data);
  } catch (error: unknown) {
    throw normalizeHttpError(error);
  }
};

export const getStoreRequest = async (storeId: string): Promise<StoreDetailResponseDto> => {
  try {
    const response = await apiClient.get(`/stores/${storeId}`);
    return storeDetailResponseDtoSchema.parse(response.data);
  } catch (error: unknown) {
    throw normalizeHttpError(error);
  }
};

export const createStoreRequest = async (storeInput: StoreInput): Promise<StoreDetailResponseDto> => {
  const payload = storeInputSchema.parse(storeInput);

  try {
    const response = await apiClient.post("/stores", payload);
    return storeDetailResponseDtoSchema.parse(response.data);
  } catch (error: unknown) {
    throw normalizeHttpError(error);
  }
};

export const updateStoreRequest = async (
  storeId: string,
  storeInput: StoreInput
): Promise<StoreDetailResponseDto> => {
  const payload = storeInputSchema.parse(storeInput);

  try {
    const response = await apiClient.put(`/stores/${storeId}`, payload);
    return storeDetailResponseDtoSchema.parse(response.data);
  } catch (error: unknown) {
    throw normalizeHttpError(error);
  }
};

export const deleteStoreRequest = async (storeId: string): Promise<void> => {
  try {
    await apiClient.delete(`/stores/${storeId}`);
  } catch (error: unknown) {
    throw normalizeHttpError(error);
  }
};

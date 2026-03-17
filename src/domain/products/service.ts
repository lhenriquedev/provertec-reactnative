import {
  productDetailResponseDtoSchema,
  productInputSchema,
  productListResponseDtoSchema,
  productUpdateInputSchema,
} from "@/src/domain/products/schemas";
import type {
  ProductDetailResponseDto,
  ProductFilters,
  ProductInput,
  ProductListResponseDto,
  ProductUpdateInput,
} from "@/src/domain/products/types";
import { apiClient } from "@/src/infra/http/api-client";
import { normalizeHttpError } from "@/src/infra/http/errors";

export const listProductsRequest = async (
  productFilters: ProductFilters
): Promise<ProductListResponseDto> => {
  try {
    const response = await apiClient.get("/products", {
      params: {
        storeId: productFilters.storeId,
      },
    });

    return productListResponseDtoSchema.parse(response.data);
  } catch (error: unknown) {
    throw normalizeHttpError(error);
  }
};

export const getProductRequest = async (
  productId: string
): Promise<ProductDetailResponseDto> => {
  try {
    const response = await apiClient.get(`/products/${productId}`);
    return productDetailResponseDtoSchema.parse(response.data);
  } catch (error: unknown) {
    throw normalizeHttpError(error);
  }
};

export const createProductRequest = async (
  productInput: ProductInput
): Promise<ProductDetailResponseDto> => {
  const payload = productInputSchema.parse(productInput);

  try {
    const response = await apiClient.post("/products", payload);
    return productDetailResponseDtoSchema.parse(response.data);
  } catch (error: unknown) {
    throw normalizeHttpError(error);
  }
};

export const updateProductRequest = async (
  productId: string,
  productInput: ProductUpdateInput
): Promise<ProductDetailResponseDto> => {
  const payload = productUpdateInputSchema.parse(productInput);

  try {
    const response = await apiClient.put(`/products/${productId}`, payload);
    return productDetailResponseDtoSchema.parse(response.data);
  } catch (error: unknown) {
    throw normalizeHttpError(error);
  }
};

export const deleteProductRequest = async (productId: string): Promise<void> => {
  try {
    await apiClient.delete(`/products/${productId}`);
  } catch (error: unknown) {
    throw normalizeHttpError(error);
  }
};

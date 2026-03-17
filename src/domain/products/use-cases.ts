import {
  mapProductDtoToProduct,
  mapProductInputToPayload,
  mapProductUpdateInputToPayload,
} from "@/src/domain/products/adapters";
import {
  createProductRequest,
  deleteProductRequest,
  getProductRequest,
  listProductsRequest,
  updateProductRequest,
} from "@/src/domain/products/service";
import type {
  Product,
  ProductFilters,
  ProductInput,
  ProductUpdateInput,
} from "@/src/domain/products/types";

export const listProducts = async (
  productFilters: ProductFilters = {}
): Promise<Product[]> => {
  const response = await listProductsRequest(productFilters);
  return response.products.map(mapProductDtoToProduct);
};

export const getProductById = async (productId: string): Promise<Product> => {
  const response = await getProductRequest(productId);
  return mapProductDtoToProduct(response.product);
};

export const createProduct = async (productInput: ProductInput): Promise<Product> => {
  const response = await createProductRequest(mapProductInputToPayload(productInput));
  return mapProductDtoToProduct(response.product);
};

export const updateProduct = async (
  productId: string,
  productInput: ProductUpdateInput
): Promise<Product> => {
  const response = await updateProductRequest(
    productId,
    mapProductUpdateInputToPayload(productInput)
  );

  return mapProductDtoToProduct(response.product);
};

export const deleteProduct = async (productId: string): Promise<void> => {
  await deleteProductRequest(productId);
};

import {
  mapProductDtoToProduct,
  mapProductInputToPayload,
  mapProductUpdateInputToPayload,
} from "@/src/features/products/adapters/ProductAdapter";
import type { IProductRepository } from "@/src/features/products/repository/IProductRepository";
import type {
  Product,
  ProductFilters,
  ProductInput,
  ProductUpdateInput,
} from "@/src/features/products/types/product.types";

import {
  createProductRequest,
  deleteProductRequest,
  getProductRequest,
  listProductsRequest,
  updateProductRequest,
} from "@/src/domain/products/service";

export class ProductRepository implements IProductRepository {
  async list(productFilters: ProductFilters = {}): Promise<Product[]> {
    const response = await listProductsRequest(productFilters);
    return response.products.map(mapProductDtoToProduct);
  }

  async getById(productId: string): Promise<Product> {
    const response = await getProductRequest(productId);
    return mapProductDtoToProduct(response.product);
  }

  async create(productInput: ProductInput): Promise<Product> {
    const response = await createProductRequest(
      mapProductInputToPayload(productInput)
    );

    return mapProductDtoToProduct(response.product);
  }

  async update(
    productId: string,
    productInput: ProductUpdateInput
  ): Promise<Product> {
    const response = await updateProductRequest(
      productId,
      mapProductUpdateInputToPayload(productInput)
    );

    return mapProductDtoToProduct(response.product);
  }

  async delete(productId: string): Promise<void> {
    await deleteProductRequest(productId);
  }
}

export const productRepository = new ProductRepository();

import type {
  Product,
  ProductFilters,
  ProductInput,
  ProductUpdateInput,
} from "@/src/features/products/types/product.types";

export interface IProductRepository {
  list(productFilters?: ProductFilters): Promise<Product[]>;
  getById(productId: string): Promise<Product>;
  create(productInput: ProductInput): Promise<Product>;
  update(productId: string, productInput: ProductUpdateInput): Promise<Product>;
  delete(productId: string): Promise<void>;
}

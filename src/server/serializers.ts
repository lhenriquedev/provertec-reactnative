import type {
  ProductModelShape,
  SerializedProduct,
  SerializedStore,
  StoreModelShape,
} from "@/src/server/types";

export function serializeStore(store: StoreModelShape): SerializedStore {
  return {
    id: store.id,
    name: store.name,
    address: store.address,
    productsCount: store.products.length,
  };
}

export function serializeProduct(
  product: ProductModelShape
): SerializedProduct {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    storeId: product.storeId,
  };
}

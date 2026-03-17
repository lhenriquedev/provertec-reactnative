import type {
  Product,
  ProductDto,
  ProductInput,
  ProductUpdateInput,
} from "@/src/domain/products/types";

export const mapProductDtoToProduct = (productDto: ProductDto): Product => {
  return {
    id: productDto.id,
    name: productDto.name,
    category: productDto.category,
    price: productDto.price,
    storeId: productDto.storeId,
  };
};

export const mapProductInputToPayload = (
  productInput: ProductInput
): ProductInput => {
  return {
    name: productInput.name.trim(),
    category: productInput.category.trim(),
    price: productInput.price,
    storeId: productInput.storeId.trim(),
  };
};

export const mapProductUpdateInputToPayload = (
  productInput: ProductUpdateInput
): ProductUpdateInput => {
  return {
    name: productInput.name.trim(),
    category: productInput.category.trim(),
    price: productInput.price,
  };
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  storeId: string;
};

export type ProductInput = {
  name: string;
  category: string;
  price: number;
  storeId: string;
};

export type ProductUpdateInput = {
  name: string;
  category: string;
  price: number;
};

export type ProductFilters = {
  storeId?: string;
};

export type ProductDto = {
  id: string;
  name: string;
  category: string;
  price: number;
  storeId: string;
};

export type ProductListResponseDto = {
  products: ProductDto[];
};

export type ProductDetailResponseDto = {
  product: ProductDto;
};

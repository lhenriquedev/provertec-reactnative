export type Store = {
  id: string;
  name: string;
  address: string;
  productsCount: number;
};

export type StoreInput = {
  name: string;
  address: string;
};

export type StoreDto = {
  id: string;
  name: string;
  address: string;
  productsCount: number;
};

export type StoreListResponseDto = {
  stores: StoreDto[];
};

export type StoreDetailResponseDto = {
  store: StoreDto;
};

export type StoreInput = {
  name: string;
  address: string;
};

export type ProductInput = {
  name: string;
  category: string;
  price: number;
  storeId: string;
};

export type SerializedStore = StoreInput & {
  id: string;
  productsCount: number;
};

export type SerializedProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  storeId: string;
};

export type ProductModelShape = SerializedProduct & {
  update: (attrs: {
    name: string;
    category: string;
    price: number;
  }) => ProductModelShape;
  destroy: () => void;
};

export type StoreModelShape = StoreInput & {
  id: string;
  update: (attrs: StoreInput) => StoreModelShape;
  products: {
    length: number;
    models: ProductModelShape[];
  };
  destroy: () => void;
};

export type MockSchemaShape = {
  stores: {
    all: () => {
      models: StoreModelShape[];
    };
    find: (id: string) => StoreModelShape | null;
    create: (attrs: StoreInput) => StoreModelShape;
  };
  products: {
    all: () => {
      models: ProductModelShape[];
    };
    where: (query: { storeId: string }) => {
      models: ProductModelShape[];
    };
    find: (id: string) => ProductModelShape | null;
    create: (attrs: {
      name: string;
      category: string;
      price: number;
      store: StoreModelShape;
    }) => ProductModelShape;
  };
};

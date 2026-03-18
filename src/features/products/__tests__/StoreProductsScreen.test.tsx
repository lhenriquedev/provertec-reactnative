import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";

import { StoreProductsScreen } from "@/src/features/products/screens/StoreProductsScreen";

const mockBack = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockRefetchProducts = jest.fn();
const mockSettleCreate = jest.fn();
const mockSettleUpdate = jest.fn();
const mockSettleDelete = jest.fn();

jest.mock("expo-router", () => ({
  router: {
    back: mockBack,
    push: mockPush,
    replace: mockReplace,
  },
  useLocalSearchParams: () => ({ id: "1" }),
}));

jest.mock("@/src/features/stores/hooks/useStores", () => ({
  useStoreDetails: jest.fn(),
}));

jest.mock("@/src/features/products/hooks/useProducts", () => ({
  useProducts: jest.fn(),
}));

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("@/src/shared/components/LoadingSpinner", () => ({
  LoadingSpinner: ({ label }: { label: string }) => <>{label}</>,
}));

jest.mock("@/src/shared/components/EmptyState", () => ({
  EmptyState: ({
    title,
    description,
    actionLabel,
    onAction,
  }: {
    title: string;
    description: string;
    actionLabel: string;
    onAction: () => void;
  }) => {
    const { Pressable, Text, View } = require("react-native");

    return (
      <View>
        <Text>{title}</Text>
        <Text>{description}</Text>
        <Pressable onPress={onAction}>
          <Text>{actionLabel}</Text>
        </Pressable>
      </View>
    );
  },
}));

jest.mock("@/src/features/products/components/CreateProductActionsheet", () => ({
  CreateProductActionsheet: () => null,
}));

jest.mock("@/src/features/products/components/EditProductActionsheet", () => ({
  EditProductActionsheet: () => null,
}));

jest.mock("@/src/features/products/components/DeleteProductAlertDialog", () => ({
  DeleteProductAlertDialog: () => null,
}));

jest.mock("@/src/features/products/components/ProductList", () => ({
  ProductList: ({
    products,
  }: {
    products: Array<{ id: string; name: string }>;
  }) => {
    const { Text, View } = require("react-native");

    return (
      <View>
        {products.map((product) => (
          <View key={product.id}>
            <Text>{product.name}</Text>
            <Text>Editar</Text>
            <Text>Excluir</Text>
          </View>
        ))}
      </View>
    );
  },
}));

const { useStoreDetails } = jest.requireMock("@/src/features/stores/hooks/useStores") as {
  useStoreDetails: jest.Mock;
};

const { useProducts } = jest.requireMock("@/src/features/products/hooks/useProducts") as {
  useProducts: jest.Mock;
};

const createStoreQuery = (overrides?: Record<string, unknown>) => ({
  data: {
    id: "1",
    name: "Loja Centro",
    address: "Rua das Flores, 120",
    productsCount: 2,
  },
  isLoading: false,
  isError: false,
  error: null,
  ...overrides,
});

const createProductsHook = (overrides?: Record<string, unknown>) => ({
  productsQuery: {
    data: [
      {
        id: "10",
        name: "Fone Bluetooth",
        category: "Eletronicos",
        price: 249.9,
        storeId: "1",
      },
      {
        id: "11",
        name: "Mouse Sem Fio",
        category: "Eletronicos",
        price: 129.9,
        storeId: "1",
      },
    ],
    isLoading: false,
    isError: false,
    error: null,
    refetch: mockRefetchProducts,
  },
  createProductMutation: {
    mutateAsync: mockSettleCreate,
    isPending: false,
    error: null,
    reset: jest.fn(),
  },
  updateProductMutation: {
    mutateAsync: mockSettleUpdate,
    isPending: false,
    error: null,
    reset: jest.fn(),
  },
  deleteProductMutation: {
    mutateAsync: mockSettleDelete,
    isPending: false,
    error: null,
    reset: jest.fn(),
  },
  ...overrides,
});

describe("StoreProductsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useStoreDetails.mockReturnValue(createStoreQuery());
    useProducts.mockReturnValue(createProductsHook());
  });

  it("renders the stitched catalog view with store context and product actions", () => {
    render(<StoreProductsScreen />);

    expect(screen.getByText("Catalogo da loja")).toBeTruthy();
    expect(screen.getByText("Loja Centro")).toBeTruthy();
    expect(screen.getByText("Rua das Flores, 120")).toBeTruthy();
    expect(screen.getByText("Fone Bluetooth")).toBeTruthy();
    expect(screen.getByText("Mouse Sem Fio")).toBeTruthy();
    expect(screen.getAllByText("Editar").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Excluir").length).toBeGreaterThan(0);
  });

  it("renders the empty catalog state with create CTA", () => {
    useProducts.mockReturnValue(
      createProductsHook({
        productsQuery: {
          data: [],
          isLoading: false,
          isError: false,
          error: null,
          refetch: mockRefetchProducts,
        },
      }),
    );

    render(<StoreProductsScreen />);

    expect(screen.getByText("Nenhum produto nesta loja")).toBeTruthy();
    expect(screen.getByText("Novo produto")).toBeTruthy();
  });

  it("renders the catalog error state and retries loading", () => {
    useProducts.mockReturnValue(
      createProductsHook({
        productsQuery: {
          data: [],
          isLoading: false,
          isError: true,
          error: new Error("request failed"),
          refetch: mockRefetchProducts,
        },
      }),
    );

    render(<StoreProductsScreen />);

    fireEvent.press(screen.getByText("Tentar novamente"));

    expect(screen.getByText("Erro ao carregar produtos")).toBeTruthy();
    expect(mockRefetchProducts).toHaveBeenCalledTimes(1);
  });
});

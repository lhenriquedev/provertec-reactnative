import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  useCreateProductMutation,
  useDeleteProductMutation,
} from "@/src/features/products/queries/mutations";
import { productQueryKeys } from "@/src/features/products/queries/query-keys";
import { storeQueryKeys } from "@/src/features/stores/queries/query-keys";

jest.mock("@tanstack/react-query", () => ({
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
}));

const mockedUseMutation = jest.mocked(useMutation);
const mockedUseQueryClient = jest.mocked(useQueryClient);

describe("product mutations cache sync", () => {
  const invalidateQueries = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseQueryClient.mockReturnValue({
      invalidateQueries,
    } as never);
    mockedUseMutation.mockImplementation((options) => options as never);
  });

  it("invalidates product and store queries after creating a product", async () => {
    const mutation = useCreateProductMutation();

    await mutation.onSuccess?.(
      {
        id: "10",
        name: "Novo Produto",
        category: "Eletronicos",
        price: 199.9,
        storeId: "1",
      },
      {
        name: "Novo Produto",
        category: "Eletronicos",
        price: 199.9,
        storeId: "1",
      },
      undefined,
      undefined,
    );

    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: productQueryKeys.all,
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: storeQueryKeys.all,
    });
  });

  it("invalidates product and store queries after deleting a product", async () => {
    const mutation = useDeleteProductMutation();

    await mutation.onSuccess?.(undefined, "10", undefined, undefined);

    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: productQueryKeys.all,
    });
    expect(invalidateQueries).toHaveBeenCalledWith({
      queryKey: storeQueryKeys.all,
    });
  });
});

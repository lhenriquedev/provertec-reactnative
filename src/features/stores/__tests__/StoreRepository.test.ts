import type { StoreDto, StoreInput } from "@/src/domain/stores/types";
import { StoreRepository } from "@/src/features/stores/repository/StoreRepository";

import {
  createStoreRequest,
  getStoreRequest,
  listStoresRequest,
  updateStoreRequest,
} from "@/src/domain/stores/service";

jest.mock("@/src/domain/stores/service", () => ({
  listStoresRequest: jest.fn(),
  getStoreRequest: jest.fn(),
  createStoreRequest: jest.fn(),
  updateStoreRequest: jest.fn(),
  deleteStoreRequest: jest.fn(),
}));

const mockedListStoresRequest = jest.mocked(listStoresRequest);
const mockedGetStoreRequest = jest.mocked(getStoreRequest);
const mockedCreateStoreRequest = jest.mocked(createStoreRequest);
const mockedUpdateStoreRequest = jest.mocked(updateStoreRequest);

describe("StoreRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("maps the store list response into entities", async () => {
    const stores: StoreDto[] = [
      {
        id: "1",
        name: "Loja Centro",
        address: "Rua A",
        productsCount: 3,
      },
    ];

    mockedListStoresRequest.mockResolvedValue({ stores });

    const repository = new StoreRepository();

    await expect(repository.list()).resolves.toEqual(stores);
  });

  it("sanitizes values before creating a store", async () => {
    const input: StoreInput = {
      name: "  Loja Nova  ",
      address: "  Rua B  ",
    };

    mockedCreateStoreRequest.mockResolvedValue({
      store: {
        id: "2",
        name: "Loja Nova",
        address: "Rua B",
        productsCount: 0,
      },
    });

    const repository = new StoreRepository();

    await repository.create(input);

    expect(mockedCreateStoreRequest).toHaveBeenCalledWith({
      name: "Loja Nova",
      address: "Rua B",
    });
  });

  it("loads one store by id", async () => {
    mockedGetStoreRequest.mockResolvedValue({
      store: {
        id: "9",
        name: "Loja Norte",
        address: "Rua C",
        productsCount: 2,
      },
    });

    const repository = new StoreRepository();

    await expect(repository.getById("9")).resolves.toEqual({
      id: "9",
      name: "Loja Norte",
      address: "Rua C",
      productsCount: 2,
    });
  });

  it("sanitizes values before updating a store", async () => {
    mockedUpdateStoreRequest.mockResolvedValue({
      store: {
        id: "9",
        name: "Loja Sul",
        address: "Rua D",
        productsCount: 5,
      },
    });

    const repository = new StoreRepository();

    await repository.update("9", {
      name: "  Loja Sul  ",
      address: "  Rua D  ",
    });

    expect(mockedUpdateStoreRequest).toHaveBeenCalledWith("9", {
      name: "Loja Sul",
      address: "Rua D",
    });
  });
});

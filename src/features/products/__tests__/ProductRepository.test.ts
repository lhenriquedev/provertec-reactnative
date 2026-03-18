import type { ProductDto } from "@/src/domain/products/types";
import { ProductRepository } from "@/src/features/products/repository/ProductRepository";

import {
  createProductRequest,
  getProductRequest,
  listProductsRequest,
  updateProductRequest,
} from "@/src/domain/products/service";

jest.mock("@/src/domain/products/service", () => ({
  listProductsRequest: jest.fn(),
  getProductRequest: jest.fn(),
  createProductRequest: jest.fn(),
  updateProductRequest: jest.fn(),
  deleteProductRequest: jest.fn(),
}));

const mockedListProductsRequest = jest.mocked(listProductsRequest);
const mockedGetProductRequest = jest.mocked(getProductRequest);
const mockedCreateProductRequest = jest.mocked(createProductRequest);
const mockedUpdateProductRequest = jest.mocked(updateProductRequest);

describe("ProductRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("maps the filtered product list response into entities", async () => {
    const products: ProductDto[] = [
      {
        id: "10",
        name: "Fone",
        category: "Eletronicos",
        price: 199.9,
        storeId: "1",
      },
    ];

    mockedListProductsRequest.mockResolvedValue({ products });

    const repository = new ProductRepository();

    await expect(repository.list({ storeId: "1" })).resolves.toEqual(products);
    expect(mockedListProductsRequest).toHaveBeenCalledWith({ storeId: "1" });
  });

  it("trims fields before creating a product", async () => {
    mockedCreateProductRequest.mockResolvedValue({
      product: {
        id: "11",
        name: "Mouse",
        category: "Eletronicos",
        price: 129.9,
        storeId: "2",
      },
    });

    const repository = new ProductRepository();

    await repository.create({
      name: "  Mouse  ",
      category: "  Eletronicos  ",
      price: 129.9,
      storeId: "  2  ",
    });

    expect(mockedCreateProductRequest).toHaveBeenCalledWith({
      name: "Mouse",
      category: "Eletronicos",
      price: 129.9,
      storeId: "2",
    });
  });

  it("loads one product by id", async () => {
    mockedGetProductRequest.mockResolvedValue({
      product: {
        id: "12",
        name: "Garrafa",
        category: "Casa",
        price: 89.9,
        storeId: "3",
      },
    });

    const repository = new ProductRepository();

    await expect(repository.getById("12")).resolves.toEqual({
      id: "12",
      name: "Garrafa",
      category: "Casa",
      price: 89.9,
      storeId: "3",
    });
  });

  it("trims editable fields before updating a product", async () => {
    mockedUpdateProductRequest.mockResolvedValue({
      product: {
        id: "12",
        name: "Garrafa Termica",
        category: "Casa",
        price: 99.9,
        storeId: "3",
      },
    });

    const repository = new ProductRepository();

    await repository.update("12", {
      name: "  Garrafa Termica  ",
      category: "  Casa  ",
      price: 99.9,
    });

    expect(mockedUpdateProductRequest).toHaveBeenCalledWith("12", {
      name: "Garrafa Termica",
      category: "Casa",
      price: 99.9,
    });
  });
});

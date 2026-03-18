import type { Server } from "miragejs";

import { seedServer } from "@/src/server/seeds";

type CreateSpy = jest.MockedFunction<Server["create"]>;

describe("seedServer", () => {
  it("creates products bound to their store associations", () => {
    const createdStores = [
      { id: "store-1" },
      { id: "store-2" },
      { id: "store-3" },
    ];

    const create = jest.fn<
      ReturnType<Server["create"]>,
      Parameters<Server["create"]>
    >();

    create
      .mockReturnValueOnce(createdStores[0] as ReturnType<Server["create"]>)
      .mockReturnValueOnce(createdStores[1] as ReturnType<Server["create"]>)
      .mockReturnValueOnce(createdStores[2] as ReturnType<Server["create"]>)
      .mockReturnValue({} as ReturnType<Server["create"]>);

    const server = {
      create,
    } as Pick<Server, "create"> as Server;

    seedServer(server);

    const typedCreate = create as CreateSpy;

    expect(typedCreate).toHaveBeenNthCalledWith(1, "store", {
      name: "Loja Centro",
      address: "Rua das Flores, 120",
    });
    expect(typedCreate).toHaveBeenNthCalledWith(2, "store", {
      name: "Loja Norte",
      address: "Avenida Brasil, 890",
    });
    expect(typedCreate).toHaveBeenNthCalledWith(3, "store", {
      name: "Loja Sul",
      address: "Rua do Comercio, 45",
    });

    expect(typedCreate).toHaveBeenNthCalledWith(4, "product", {
      name: "Camiseta Basica",
      category: "Roupas",
      price: 59.9,
      store: createdStores[0],
    });
    expect(typedCreate).toHaveBeenNthCalledWith(5, "product", {
      name: "Tenis Casual",
      category: "Calcados",
      price: 199.9,
      store: createdStores[0],
    });
    expect(typedCreate).toHaveBeenNthCalledWith(6, "product", {
      name: "Fone Bluetooth",
      category: "Eletronicos",
      price: 249.9,
      store: createdStores[1],
    });
    expect(typedCreate).toHaveBeenNthCalledWith(7, "product", {
      name: "Mouse Sem Fio",
      category: "Eletronicos",
      price: 129.9,
      store: createdStores[1],
    });
    expect(typedCreate).toHaveBeenNthCalledWith(8, "product", {
      name: "Garrafa Termica",
      category: "Casa",
      price: 89.9,
      store: createdStores[2],
    });
  });
});

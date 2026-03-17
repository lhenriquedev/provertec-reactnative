import type { Server } from "miragejs";

export function seedServer(server: Server) {
  server.db.loadData({
    stores: [
      {
        id: "1",
        name: "Loja Centro",
        address: "Rua das Flores, 120",
      },
      {
        id: "2",
        name: "Loja Norte",
        address: "Avenida Brasil, 890",
      },
      {
        id: "3",
        name: "Loja Sul",
        address: "Rua do Comercio, 45",
      },
    ],
    products: [
      {
        id: "1",
        name: "Camiseta Basica",
        category: "Roupas",
        price: 59.9,
        storeId: "1",
      },
      {
        id: "2",
        name: "Tenis Casual",
        category: "Calcados",
        price: 199.9,
        storeId: "1",
      },
      {
        id: "3",
        name: "Fone Bluetooth",
        category: "Eletronicos",
        price: 249.9,
        storeId: "2",
      },
      {
        id: "4",
        name: "Mouse Sem Fio",
        category: "Eletronicos",
        price: 129.9,
        storeId: "2",
      },
      {
        id: "5",
        name: "Garrafa Termica",
        category: "Casa",
        price: 89.9,
        storeId: "3",
      },
    ],
  });
}

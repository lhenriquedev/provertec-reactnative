import { Response, type Server } from "miragejs";

import { serializeProduct } from "@/src/server/serializers";
import type { MockSchemaShape, ProductModelShape } from "@/src/server/types";
import { parseProductInput } from "@/src/server/validators";

const PRODUCT_NOT_FOUND = { message: "Produto nao encontrado." };
const STORE_NOT_FOUND = { message: "Loja nao encontrada." };
const INVALID_PRODUCT_PAYLOAD = {
  message:
    "Payload invalido. Informe nome, categoria, preco e storeId validos.",
};

function parseRequestBody(requestBody: string): unknown {
  if (!requestBody) {
    return null;
  }

  return JSON.parse(requestBody) as unknown;
}

function toProductModelShape(product: unknown): ProductModelShape | null {
  if (!product) {
    return null;
  }

  return product as ProductModelShape;
}

function toMockSchema(schema: unknown): MockSchemaShape {
  return schema as MockSchemaShape;
}

export function registerProductRoutes(server: Server) {
  server.get("/products", (schema, request) => {
    const mockSchema = toMockSchema(schema);
    const storeId = Array.isArray(request.queryParams.storeId)
      ? request.queryParams.storeId[0]
      : request.queryParams.storeId;
    const products = storeId
      ? mockSchema.products.where({ storeId }).models
      : mockSchema.products.all().models;

    return {
      products: products.map((product) =>
        serializeProduct(product as ProductModelShape)
      ),
    };
  });

  server.get("/products/:id", (schema, request) => {
    const mockSchema = toMockSchema(schema);
    const product = toProductModelShape(
      mockSchema.products.find(request.params.id)
    );

    if (!product) {
      return new Response(404, {}, PRODUCT_NOT_FOUND);
    }

    return { product: serializeProduct(product) };
  });

  server.post("/products", (schema, request) => {
    const mockSchema = toMockSchema(schema);
    const payload = parseProductInput(parseRequestBody(request.requestBody), {
      requireStoreId: true,
    });

    if (!payload) {
      return new Response(422, {}, INVALID_PRODUCT_PAYLOAD);
    }

    const store = mockSchema.stores.find(payload.storeId);

    if (!store) {
      return new Response(404, {}, STORE_NOT_FOUND);
    }

    const product = mockSchema.products.create({
      name: payload.name,
      category: payload.category,
      price: payload.price,
      store,
    }) as ProductModelShape;

    return new Response(201, {}, { product: serializeProduct(product) });
  });

  server.put("/products/:id", (schema, request) => {
    const mockSchema = toMockSchema(schema);
    const product = toProductModelShape(
      mockSchema.products.find(request.params.id)
    );

    if (!product) {
      return new Response(404, {}, PRODUCT_NOT_FOUND);
    }

    const payload = parseProductInput(parseRequestBody(request.requestBody), {
      requireStoreId: false,
    });

    if (!payload) {
      return new Response(422, {}, INVALID_PRODUCT_PAYLOAD);
    }

    product.update({
      name: payload.name,
      category: payload.category,
      price: payload.price,
    });

    return { product: serializeProduct(product) };
  });

  server.del("/products/:id", (schema, request) => {
    const mockSchema = toMockSchema(schema);
    const product = toProductModelShape(
      mockSchema.products.find(request.params.id)
    );

    if (!product) {
      return new Response(404, {}, PRODUCT_NOT_FOUND);
    }

    product.destroy();

    return new Response(204);
  });
}

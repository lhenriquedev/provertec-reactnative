import { Response, type Server } from "miragejs";

import { serializeStore } from "@/src/server/serializers";
import type { MockSchemaShape, StoreModelShape } from "@/src/server/types";
import { parseStoreInput } from "@/src/server/validators";

const STORE_NOT_FOUND = { message: "Loja nao encontrada." };
const INVALID_STORE_PAYLOAD = {
  message: "Payload invalido. Informe nome e endereco obrigatorios.",
};

function parseRequestBody(requestBody: string): unknown {
  if (!requestBody) {
    return null;
  }

  return JSON.parse(requestBody) as unknown;
}

function toStoreModelShape(store: unknown): StoreModelShape | null {
  if (!store) {
    return null;
  }

  return store as StoreModelShape;
}

function toMockSchema(schema: unknown): MockSchemaShape {
  return schema as MockSchemaShape;
}

export function registerStoreRoutes(server: Server) {
  server.get("/stores", (schema) => {
    const mockSchema = toMockSchema(schema);
    const stores = mockSchema.stores
      .all()
      .models.map((store) => serializeStore(store as StoreModelShape));

    return { stores };
  });

  server.get("/stores/:id", (schema, request) => {
    const mockSchema = toMockSchema(schema);
    const store = toStoreModelShape(mockSchema.stores.find(request.params.id));

    if (!store) {
      return new Response(404, {}, STORE_NOT_FOUND);
    }

    return { store: serializeStore(store) };
  });

  server.post("/stores", (schema, request) => {
    const mockSchema = toMockSchema(schema);
    const payload = parseStoreInput(parseRequestBody(request.requestBody));

    if (!payload) {
      return new Response(422, {}, INVALID_STORE_PAYLOAD);
    }

    const store = mockSchema.stores.create(payload);

    return new Response(201, {}, { store: serializeStore(store) });
  });

  server.put("/stores/:id", (schema, request) => {
    const mockSchema = toMockSchema(schema);
    const store = toStoreModelShape(mockSchema.stores.find(request.params.id));

    if (!store) {
      return new Response(404, {}, STORE_NOT_FOUND);
    }

    const payload = parseStoreInput(parseRequestBody(request.requestBody));

    if (!payload) {
      return new Response(422, {}, INVALID_STORE_PAYLOAD);
    }

    store.update(payload);

    return { store: serializeStore(store) };
  });

  server.del("/stores/:id", (schema, request) => {
    const mockSchema = toMockSchema(schema);
    const store = toStoreModelShape(mockSchema.stores.find(request.params.id));

    if (!store) {
      return new Response(404, {}, STORE_NOT_FOUND);
    }

    store.products.models.forEach((product) => product.destroy());
    store.destroy();

    return new Response(204);
  });
}

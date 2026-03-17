import {
  Model,
  belongsTo,
  createServer,
  hasMany,
  type Server,
} from "miragejs";

import { registerProductRoutes } from "@/src/server/routes/products";
import { registerStoreRoutes } from "@/src/server/routes/stores";
import { seedServer } from "@/src/server/seeds";

let serverInstance: Server | undefined;

export function makeServer({ environment = "development" } = {}) {
  return createServer({
    environment,
    timing: 300,

    models: {
      store: Model.extend({
        products: hasMany(),
      }),
      product: Model.extend({
        store: belongsTo(),
      }),
    },

    seeds(server) {
      seedServer(server);
    },

    routes() {
      this.namespace = "api";

      registerStoreRoutes(this);
      registerProductRoutes(this);

      this.get("/health", () => ({ status: "ok" }));
      this.passthrough((request) => !request.url.includes("/api/"));
    },
  });
}

export function initializeMockServer() {
  if (serverInstance) {
    return serverInstance;
  }

  serverInstance = makeServer();
  return serverInstance;
}

export function shutdownMockServer() {
  if (!serverInstance) {
    return;
  }

  serverInstance.shutdown();
  serverInstance = undefined;
}

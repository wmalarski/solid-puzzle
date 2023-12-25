import { createMiddleware } from "@solidjs/start/server";
import { luciaMiddleware } from "./server/auth/lucia";
import { drizzleMiddleware } from "./server/db";
import { serverEnvMiddleware } from "./server/env";

export default createMiddleware({
  onRequest: async (event) => {
    await serverEnvMiddleware(event);
    drizzleMiddleware(event);
    await luciaMiddleware(event);
  },
});

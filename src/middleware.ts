import { createMiddleware } from "@solidjs/start/server";
import { luciaMiddleware } from "./server/auth/lucia";
import { drizzleMiddleware } from "./server/db";
import { serverEnvMiddleware } from "./server/env";

export default createMiddleware({
  onRequest: [
    serverEnvMiddleware,
    drizzleMiddleware,
    luciaMiddleware,
    (event) => {
      if (event.method === "POST") {
        console.log("EVENT", Object.fromEntries(event.headers.entries()));
      }
    },
  ],
});

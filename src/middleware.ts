import { createMiddleware } from "@solidjs/start/server";
import { luciaMiddleware } from "./server/auth/lucia";

export default createMiddleware({
  onRequest: async (event) => {
    await luciaMiddleware(event);
  },
});

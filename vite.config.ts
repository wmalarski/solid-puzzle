import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  start: {
    ssr: false,
    middleware: "./src/middleware.ts"
  },
});

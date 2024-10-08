import { defineConfig } from "@solidjs/start/config";

// https://ryanjc.com/blog/solidstart-cloudflare-pages/
export default defineConfig({
  middleware: "./src/middleware.ts",
  server: {
    preset: "cloudflare-pages",
    // We will need to enable CF Pages node compatiblity
    // https://developers.cloudflare.com/workers/runtime-apis/nodejs/asynclocalstorage/
    rollupConfig: {
      external: ["node:async_hooks"]
    }
  },
  vite: {
    ssr: {
      noExternal: ["@kobalte/core"]
    }
  }
});

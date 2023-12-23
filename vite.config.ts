import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  ssr: { noExternal: ["@kobalte/core"] },
});

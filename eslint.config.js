import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import tailwind from "eslint-plugin-tailwindcss";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...tailwind.configs["flat/recommended"]
];

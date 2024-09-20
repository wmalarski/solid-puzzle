import pluginJs from "@eslint/js";
import * as tsParser from "@typescript-eslint/parser";
import jsxA11y from "eslint-plugin-jsx-a11y";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import pluginPromise from "eslint-plugin-promise";
import solid from "eslint-plugin-solid/configs/recommended";
import tailwind from "eslint-plugin-tailwindcss";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginPromise.configs["flat/recommended"],
  jsxA11y.flatConfigs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    ...solid,
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: "tsconfig.json" }
    }
  },
  perfectionist.configs["recommended-natural"],
  ...tailwind.configs["flat/recommended"],
  { ...eslintPluginPrettierRecommended }
];

/*
{
  "rules": {
    "no-await-in-loop": "error",
    "no-constant-binary-expression": "error",
    "no-self-compare": "error",
    "no-use-before-define": "error",
    "curly": "error",
    "eqeqeq": ["error", "smart"],
    "max-params": ["error", 3],
    "no-console": "warn",
    "no-lonely-if": "error",
    "no-unneeded-ternary": "error",
    "prefer-arrow-callback": "error",
    "prefer-const": "error",
    "require-await": "error",
    "@typescript-eslint/array-type": "error",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/no-unused-expressions": [
      "error",
      {
        "enforceForJSX": true
      }
    ],
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto"
      }
    ],
    "tailwindcss/no-custom-classname": "off",
    "jsx-a11y/label-has-associated-control": "off"
  }
}

*/

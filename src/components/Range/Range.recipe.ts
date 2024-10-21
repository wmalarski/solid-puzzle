import { twCva } from "../utils/twCva";

export const rangeRecipe = twCva("range", {
  defaultVariants: {
    color: null,
    size: null
  },
  variants: {
    color: {
      accent: "range-accent",
      error: "range-error",
      info: "range-info",
      primary: "range-primary",
      secondary: "range-secondary",
      success: "range-success",
      warning: "range-warning"
    },
    size: {
      lg: "range-lg",
      md: "range-md",
      sm: "range-sm",
      xs: "range-xs"
    }
  }
});

import { twCva } from "../utils/twCva";

export const linkRecipe = twCva("link", {
  defaultVariants: {
    color: null,
    hover: null,
    size: null
  },
  variants: {
    color: {
      accent: "link-accent",
      error: "link-error",
      info: "link-info",
      neutral: "link-neutral",
      primary: "link-primary",
      secondary: "link-secondary",
      success: "link-success",
      warning: "link-warning"
    },
    hover: {
      false: "",
      true: "link-hover"
    },
    size: {
      xs: "text-xs"
    }
  }
});

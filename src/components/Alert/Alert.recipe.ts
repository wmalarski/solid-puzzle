import { twCva } from "../utils/twCva";

export const alertRecipe = twCva("alert justify-start", {
  defaultVariants: {
    variant: null
  },
  variants: {
    variant: {
      error: "alert-error",
      info: "alert-info",
      success: "alert-success",
      warning: "alert-warning"
    }
  }
});

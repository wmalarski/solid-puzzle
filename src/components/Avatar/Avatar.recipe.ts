import { twCva } from "../utils/twCva";

export const avatarRecipe = twCva("avatar", {
  defaultVariants: {
    placeholder: null,
    presence: null
  },
  variants: {
    placeholder: {
      true: "placeholder"
    },
    presence: {
      offline: "offline",
      online: "online"
    }
  }
});

export const avatarContentRecipe = twCva("", {
  defaultVariants: {
    placeholder: null,
    ring: null,
    size: "md",
    variant: "full"
  },
  variants: {
    placeholder: {
      true: "bg-neutral-focus text-neutral-content"
    },
    ring: {
      accent: "ring ring-accent ring-offset-base-100 ring-offset-2",
      error: "ring ring-error ring-offset-base-100 ring-offset-2",
      primary: "ring ring-primary ring-offset-base-100 ring-offset-2",
      secondary: "ring ring-secondary ring-offset-base-100 ring-offset-2",
      success: "ring ring-success ring-offset-base-100 ring-offset-2",
      warning: "ring ring-warning ring-offset-base-100 ring-offset-2"
    },
    size: {
      lg: "w-32",
      md: "w-20",
      sm: "w-16",
      xs: "w-8"
    },
    variant: {
      full: "rounded-full",
      rounded: "rounded",
      xl: "rounded-xl"
    }
  }
});

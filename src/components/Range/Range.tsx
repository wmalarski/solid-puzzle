import type { VariantProps } from "class-variance-authority";

import { type Component, type ComponentProps, splitProps } from "solid-js";

import { twCva } from "../utils/twCva";

export const rangeClass = twCva("range", {
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

export type RangeProps = ComponentProps<"input"> &
  VariantProps<typeof rangeClass>;

export function Range(props: RangeProps) {
  const [split, rest] = splitProps(props, ["color", "size"]);

  return (
    <input
      type="range"
      {...rest}
      class={rangeClass({ class: props.class, ...split })}
    />
  );
}

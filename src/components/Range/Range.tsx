import type { VariantProps } from "class-variance-authority";
import { splitProps, type Component, type JSX } from "solid-js";
import { twCva } from "../utils/twCva";

export const rangeClass = twCva("range", {
  defaultVariants: {
    color: null,
    size: null,
  },
  variants: {
    color: {
      accent: "range-accent",
      error: "range-error",
      info: "range-info",
      primary: "range-primary",
      secondary: "range-secondary",
      success: "range-success",
      warning: "range-warning",
    },
    size: {
      lg: "range-lg",
      md: "range-md",
      sm: "range-sm",
      xs: "range-xs",
    },
  },
});

export type RangeProps = JSX.IntrinsicElements["input"] &
  VariantProps<typeof rangeClass>;

export const Range: Component<RangeProps> = (props) => {
  const [split, rest] = splitProps(props, ["color", "size"]);

  return (
    <input
      type="range"
      {...rest}
      class={rangeClass({ class: props.class, ...split })}
    />
  );
};

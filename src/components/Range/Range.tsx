import type { VariantProps } from "class-variance-authority";

import { Component, type ComponentProps, splitProps } from "solid-js";

import { rangeRecipe } from "./Range.recipe";

export type RangeProps = ComponentProps<"input"> &
  VariantProps<typeof rangeRecipe>;

export const Range: Component<RangeProps> = (props) => {
  const [split, rest] = splitProps(props, ["color", "size"]);

  return (
    <input
      type="range"
      {...rest}
      class={rangeRecipe({ class: props.class, ...split })}
    />
  );
};

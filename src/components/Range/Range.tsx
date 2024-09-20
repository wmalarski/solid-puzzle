import type { VariantProps } from "class-variance-authority";

import { type ComponentProps, splitProps } from "solid-js";

import { rangeClass } from "./Range.recipe";

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

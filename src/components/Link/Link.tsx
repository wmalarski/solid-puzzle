import type { VariantProps } from "class-variance-authority";

import { type ComponentProps, splitProps } from "solid-js";

import { linkClass } from "./Link.recipe";

export type LinkProps = ComponentProps<"a"> & VariantProps<typeof linkClass>;

export function Link(props: LinkProps) {
  const [split, rest] = splitProps(props, ["color", "hover", "size"]);

  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a {...rest} class={linkClass({ class: props.class, ...split })} />;
}

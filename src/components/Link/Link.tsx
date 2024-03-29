import type { VariantProps } from "class-variance-authority";

import { type ComponentProps, splitProps } from "solid-js";

import { twCva } from "../utils/twCva";

export const linkClass = twCva("link", {
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

export type LinkProps = ComponentProps<"a"> & VariantProps<typeof linkClass>;

export function Link(props: LinkProps) {
  const [split, rest] = splitProps(props, ["color", "hover", "size"]);

  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a {...rest} class={linkClass({ class: props.class, ...split })} />;
}

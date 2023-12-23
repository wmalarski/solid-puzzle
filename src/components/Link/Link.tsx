import type { VariantProps } from "class-variance-authority";
import { splitProps, type Component, type JSX } from "solid-js";
import { twCva } from "../utils/twCva";

export const linkClass = twCva("link", {
  defaultVariants: {
    color: null,
    hover: null,
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
      warning: "link-warning",
    },
    hover: {
      false: "",
      true: "link-hover",
    },
  },
});

export type LinkProps = JSX.IntrinsicElements["a"] &
  VariantProps<typeof linkClass>;

export const Link: Component<LinkProps> = (props) => {
  const [split, rest] = splitProps(props, ["color", "hover"]);

  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a {...rest} class={linkClass({ class: props.class, ...split })} />;
};

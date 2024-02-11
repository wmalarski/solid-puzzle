import type { VariantProps } from "class-variance-authority";

import { type Component, type ComponentProps, splitProps } from "solid-js";

import { twCva } from "../utils/twCva";

export const buttonClass = twCva("btn no-animation flex items-center gap-1", {
  defaultVariants: {
    color: null,
    isLoading: false,
    shape: null,
    size: "md",
    variant: null
  },
  variants: {
    color: {
      accent: "btn-accent",
      error: "btn-error",
      info: "btn-info",
      primary: "btn-primary",
      secondary: "btn-secondary",
      success: "btn-success",
      warning: "btn-warning"
    },
    isLoading: {
      false: "",
      true: "loading"
    },
    shape: {
      block: "btn-block",
      circle: "btn-circle",
      ellipsis: "btn-circle w-[unset]",
      square: "btn-square",
      wide: "btn-wide"
    },
    size: {
      lg: "btn-lg",
      md: "btn-md",
      sm: "btn-sm",
      xs: "btn-xs"
    },
    variant: {
      active: "btn-active",
      disabled: "btn-disabled",
      ghost: "btn-ghost",
      glass: "glass",
      link: "btn-link",
      outline: "btn-outline"
    }
  }
});

export const buttonSplitProps = [
  "class",
  "color",
  "isLoading",
  "shape",
  "size",
  "variant"
] as const;

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonClass>;

export const Button: Component<ButtonProps> = (props) => {
  const [split, rest] = splitProps(props, buttonSplitProps);

  return (
    <button {...rest} class={buttonClass({ class: props.class, ...split })} />
  );
};

export const buttonGroupClass = twCva("btn-group", {
  defaultVariants: {
    direction: null
  },
  variants: {
    direction: {
      horizontal: "btn-group-horizontal",
      vertical: "btn-group-vertical"
    }
  }
});

export type ButtonGroupProps = ComponentProps<"div"> &
  VariantProps<typeof buttonGroupClass>;

export const ButtonGroup: Component<ButtonGroupProps> = (props) => {
  const [split, rest] = splitProps(props, ["direction"]);

  return (
    <div {...rest} class={buttonGroupClass({ class: props.class, ...split })} />
  );
};

export type LinkButtonProps = ComponentProps<"a"> &
  VariantProps<typeof buttonClass>;

export const LinkButton: Component<LinkButtonProps> = (props) => {
  const [split, rest] = splitProps(props, buttonSplitProps);

  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a {...rest} class={buttonClass({ class: props.class, ...split })} />;
};

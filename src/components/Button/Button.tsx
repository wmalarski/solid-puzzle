import type { VariantProps } from "class-variance-authority";

import { type ComponentProps, splitProps } from "solid-js";

import { buttonClass, buttonGroupClass } from "./Button.recipe";

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

export function Button(props: ButtonProps) {
  const [split, rest] = splitProps(props, buttonSplitProps);

  return (
    <button {...rest} class={buttonClass({ class: props.class, ...split })} />
  );
}

export type ButtonGroupProps = ComponentProps<"div"> &
  VariantProps<typeof buttonGroupClass>;

export function ButtonGroup(props: ButtonGroupProps) {
  const [split, rest] = splitProps(props, ["direction"]);

  return (
    <div {...rest} class={buttonGroupClass({ class: props.class, ...split })} />
  );
}

export type LinkButtonProps = ComponentProps<"a"> &
  VariantProps<typeof buttonClass>;

export function LinkButton(props: LinkButtonProps) {
  const [split, rest] = splitProps(props, buttonSplitProps);

  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a {...rest} class={buttonClass({ class: props.class, ...split })} />;
}

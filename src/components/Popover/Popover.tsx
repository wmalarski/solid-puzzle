import type { VariantProps } from "class-variance-authority";

import { Popover as KobaltePopover } from "@kobalte/core";
import { Component, type ComponentProps, splitProps } from "solid-js";

import { buttonSplitProps } from "../Button/Button";
import { buttonClass } from "../Button/Button.recipe";
import { twCx } from "../utils/twCva";
import styles from "./Popover.module.css";

export const PopoverRoot = KobaltePopover.Root;

export type PopoverTriggerProps = ComponentProps<
  typeof KobaltePopover.Trigger
> &
  VariantProps<typeof buttonClass>;

export const PopoverTrigger: Component<PopoverTriggerProps> = (props) => {
  const [split, rest] = splitProps(props, buttonSplitProps);

  return <KobaltePopover.Trigger {...rest} class={buttonClass(split)} />;
};

export const PopoverAnchor: Component<
  ComponentProps<typeof KobaltePopover.Anchor>
> = (props) => {
  return <KobaltePopover.Anchor {...props} class={twCx("", props.class)} />;
};

export const PopoverPortal = KobaltePopover.Portal;

export const PopoverContent: Component<
  ComponentProps<typeof KobaltePopover.Content>
> = (props) => {
  return (
    <KobaltePopover.Content
      {...props}
      class={twCx(
        "z-50 bg-base-100 p-3 rounded-2xl shadow",
        styles.content,
        props.class
      )}
    />
  );
};

export const PopoverArrow: Component<
  ComponentProps<typeof KobaltePopover.Arrow>
> = (props) => {
  return <KobaltePopover.Arrow {...props} class={twCx("", props.class)} />;
};

export type PopoverHeaderProps = ComponentProps<"div">;

export const PopoverHeader: Component<PopoverHeaderProps> = (props) => {
  return (
    <div
      {...props}
      class={twCx(
        "flex items-baseline mb-1 justify-between gap-4",
        props.class
      )}
    />
  );
};

export const PopoverCloseButton: Component<
  ComponentProps<typeof KobaltePopover.CloseButton>
> = (props) => {
  return (
    <KobaltePopover.CloseButton
      {...props}
      class={twCx("h-4 w-4", props.class)}
    />
  );
};

export const PopoverTitle: Component<
  ComponentProps<typeof KobaltePopover.Title>
> = (props) => {
  return (
    <KobaltePopover.Title
      {...props}
      class={twCx("text-base uppercase font-semibold", props.class)}
    />
  );
};

export const PopoverDescription: Component<
  ComponentProps<typeof KobaltePopover.Description>
> = (props) => {
  return (
    <KobaltePopover.Description
      {...props}
      class={twCx("text-sm py-1", props.class)}
    />
  );
};

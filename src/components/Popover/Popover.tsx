import { Popover as KobaltePopover } from "@kobalte/core";
import type { VariantProps } from "class-variance-authority";
import { splitProps, type Component, type JSX } from "solid-js";
import { buttonClass } from "../Button";
import { twCx } from "../utils/twCva";
import styles from "./Popover.module.css";

export const PopoverRoot = KobaltePopover.Root;

export type PopoverTriggerProps = KobaltePopover.PopoverTriggerProps &
  VariantProps<typeof buttonClass>;

export const PopoverTrigger: Component<PopoverTriggerProps> = (props) => {
  const [split, rest] = splitProps(props, [
    "color",
    "isLoading",
    "shape",
    "size",
    "variant",
  ]);

  return (
    <KobaltePopover.Trigger
      {...rest}
      class={buttonClass({ class: props.class, ...split })}
    />
  );
};

export const PopoverAnchor: Component<KobaltePopover.PopoverAnchorProps> = (
  props
) => {
  return <KobaltePopover.Anchor {...props} class={twCx("", props.class)} />;
};

export const PopoverPortal = KobaltePopover.Portal;

export const PopoverContent: Component<KobaltePopover.PopoverContentProps> = (
  props
) => {
  return (
    <KobaltePopover.Content
      {...props}
      class={twCx(
        "z-50 bg-base-100 border-[1px] border-base-300 p-3",
        styles.content,
        props.class
      )}
    />
  );
};

export const PopoverArrow: Component<KobaltePopover.PopoverArrowProps> = (
  props
) => {
  return <KobaltePopover.Arrow {...props} class={twCx("", props.class)} />;
};

export type PopoverHeaderProps = JSX.IntrinsicElements["div"];

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
  KobaltePopover.PopoverCloseButtonProps
> = (props) => {
  return (
    <KobaltePopover.CloseButton
      {...props}
      class={twCx("h-4 w-4", props.class)}
    />
  );
};

export const PopoverTitle: Component<KobaltePopover.PopoverTitleProps> = (
  props
) => {
  return (
    <KobaltePopover.Title
      {...props}
      class={twCx("text-base uppercase font-semibold", props.class)}
    />
  );
};

export const PopoverDescription: Component<
  KobaltePopover.PopoverDescriptionProps
> = (props) => {
  return (
    <KobaltePopover.Description
      {...props}
      class={twCx("text-sm py-1", props.class)}
    />
  );
};

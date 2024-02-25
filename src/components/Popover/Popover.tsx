import type { VariantProps } from "class-variance-authority";

import { Popover as KobaltePopover } from "@kobalte/core";
import { type ComponentProps, splitProps } from "solid-js";

import { buttonClass, buttonSplitProps } from "../Button";
import { twCx } from "../utils/twCva";
import styles from "./Popover.module.css";

export const PopoverRoot = KobaltePopover.Root;

export type PopoverTriggerProps = KobaltePopover.PopoverTriggerProps &
  VariantProps<typeof buttonClass>;

export function PopoverTrigger(props: PopoverTriggerProps) {
  const [split, rest] = splitProps(props, buttonSplitProps);

  return (
    <KobaltePopover.Trigger
      {...rest}
      class={buttonClass({ class: props.class, ...split })}
    />
  );
}

export function PopoverAnchor(props: KobaltePopover.PopoverAnchorProps) {
  return <KobaltePopover.Anchor {...props} class={twCx("", props.class)} />;
}

export const PopoverPortal = KobaltePopover.Portal;

export function PopoverContent(props: KobaltePopover.PopoverContentProps) {
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
}

export function PopoverArrow(props: KobaltePopover.PopoverArrowProps) {
  return <KobaltePopover.Arrow {...props} class={twCx("", props.class)} />;
}

export type PopoverHeaderProps = ComponentProps<"div">;

export function PopoverHeader(props: PopoverHeaderProps) {
  return (
    <div
      {...props}
      class={twCx(
        "flex items-baseline mb-1 justify-between gap-4",
        props.class
      )}
    />
  );
}

export function PopoverCloseButton(
  props: KobaltePopover.PopoverCloseButtonProps
) {
  return (
    <KobaltePopover.CloseButton
      {...props}
      class={twCx("h-4 w-4", props.class)}
    />
  );
}

export function PopoverTitle(props: KobaltePopover.PopoverTitleProps) {
  return (
    <KobaltePopover.Title
      {...props}
      class={twCx("text-base uppercase font-semibold", props.class)}
    />
  );
}

export function PopoverDescription(
  props: KobaltePopover.PopoverDescriptionProps
) {
  return (
    <KobaltePopover.Description
      {...props}
      class={twCx("text-sm py-1", props.class)}
    />
  );
}

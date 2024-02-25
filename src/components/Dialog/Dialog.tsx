import type { VariantProps } from "class-variance-authority";

import { Dialog } from "@kobalte/core";
import { type ComponentProps, splitProps } from "solid-js";

import { buttonClass, buttonSplitProps } from "../Button";
import { twCx } from "../utils/twCva";
import styles from "./Dialog.module.css";

export type DialogRootProps = Dialog.DialogRootProps;

export const DialogRoot = Dialog.Root;

export type DialogTriggerProps = Dialog.DialogTriggerProps &
  VariantProps<typeof buttonClass>;

export function DialogTrigger(props: DialogTriggerProps) {
  const [split, rest] = splitProps(props, buttonSplitProps);

  return (
    <Dialog.Trigger
      {...rest}
      class={buttonClass({ class: props.class, ...split })}
    />
  );
}

export type DialogPortalProps = Dialog.DialogPortalProps;

export const DialogPortal = Dialog.Portal;

export type DialogOverlayProps = Dialog.DialogOverlayProps;

export function DialogOverlay(props: DialogOverlayProps) {
  return (
    <Dialog.Overlay
      {...props}
      class={twCx(
        "fixed inset-0 z-50 bg-base-300 bg-opacity-50",
        styles.overlay,
        props.class
      )}
    />
  );
}

export type DialogPositionerProps = ComponentProps<"div">;

export function DialogPositioner(props: DialogPositionerProps) {
  return (
    <div
      {...props}
      class={twCx(
        "fixed inset-0 z-50 flex items-center justify-center",
        props.class
      )}
    />
  );
}

export type DialogContentProps = Dialog.DialogContentProps;

export function DialogContent(props: DialogContentProps) {
  return (
    <Dialog.Content
      {...props}
      class={twCx(
        "z-50 max-w-lg bg-base-100 shadow-xl p-8 rounded-2xl",
        styles.content,
        props.class
      )}
    />
  );
}

export type DialogHeaderProps = ComponentProps<"header">;

export function DialogHeader(props: DialogHeaderProps) {
  return (
    <header
      {...props}
      class={twCx("flex items-baseline justify-between mb-3", props.class)}
    />
  );
}

export type DialogCloseButtonProps = Dialog.DialogCloseButtonProps;

export function DialogCloseButton(props: DialogCloseButtonProps) {
  return <Dialog.CloseButton {...props} class={twCx("w-4 h-4", props.class)} />;
}

export type DialogTitleProps = Dialog.DialogTitleProps;

export function DialogTitle(props: DialogTitleProps) {
  return (
    <Dialog.Title {...props} class={twCx("text-xl font-medium", props.class)} />
  );
}

export type DialogDescriptionProps = Dialog.DialogDescriptionProps;

export function DialogDescription(props: DialogDescriptionProps) {
  return (
    <Dialog.Description {...props} class={twCx("text-base", props.class)} />
  );
}

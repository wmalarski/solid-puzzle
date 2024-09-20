import type { VariantProps } from "class-variance-authority";

import { AlertDialog } from "@kobalte/core";
import { ComponentProps, splitProps } from "solid-js";

import { buttonClass } from "../Button";
import { twCx } from "../utils/twCva";
import styles from "./AlertDialog.module.css";

export type AlertDialogRootProps = ComponentProps<typeof AlertDialog.Root>;

export const AlertDialogRoot = AlertDialog.Root;

export type AlertDialogTriggerProps = ComponentProps<
  typeof AlertDialog.Trigger
> &
  VariantProps<typeof buttonClass>;

export function AlertDialogTrigger(props: AlertDialogTriggerProps) {
  const [split, rest] = splitProps(props, [
    "color",
    "isLoading",
    "shape",
    "size",
    "variant"
  ]);

  return (
    <AlertDialog.Trigger
      {...rest}
      class={buttonClass({ class: props.class, ...split })}
    />
  );
}

export type AlertDialogPortalProps = ComponentProps<typeof AlertDialog.Portal>;

export const AlertDialogPortal = AlertDialog.Portal;

export type AlertDialogOverlayProps = ComponentProps<
  typeof AlertDialog.Overlay
>;

export function AlertDialogOverlay(props: AlertDialogOverlayProps) {
  return (
    <AlertDialog.Overlay
      {...props}
      class={twCx(
        "fixed inset-0 z-50 bg-base-200 bg-opacity-80",
        styles.overlay,
        props.class
      )}
    />
  );
}

export type AlertDialogPositionerProps = ComponentProps<"div">;

export function AlertDialogPositioner(props: AlertDialogPositionerProps) {
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

export type AlertDialogContentProps = ComponentProps<
  typeof AlertDialog.Content
>;

export function AlertDialogContent(props: AlertDialogContentProps) {
  return (
    <AlertDialog.Content
      {...props}
      class={twCx(
        "z-50 max-w-lg bg-base-100 shadow-xl p-8",
        styles.content,
        props.class
      )}
    />
  );
}

export type AlertDialogHeaderProps = ComponentProps<"header">;

export function AlertDialogHeader(props: AlertDialogHeaderProps) {
  return (
    <header
      {...props}
      class={twCx("flex items-center justify-between mb-3", props.class)}
    />
  );
}

export type AlertDialogCloseButtonProps = ComponentProps<
  typeof AlertDialog.CloseButton
> &
  VariantProps<typeof buttonClass>;

export function AlertDialogCloseButton(props: AlertDialogCloseButtonProps) {
  const [split, rest] = splitProps(props, [
    "color",
    "isLoading",
    "shape",
    "size",
    "variant"
  ]);

  return (
    <AlertDialog.CloseButton
      {...rest}
      class={buttonClass({ class: props.class, ...split })}
    />
  );
}

export type AlertDialogTitleProps = ComponentProps<typeof AlertDialog.Title>;

export function AlertDialogTitle(props: AlertDialogTitleProps) {
  return (
    <AlertDialog.Title
      {...props}
      class={twCx("text-xl font-medium", props.class)}
    />
  );
}

export type AlertDialogDescriptionProps = ComponentProps<
  typeof AlertDialog.Description
>;

export function AlertDialogDescription(props: AlertDialogDescriptionProps) {
  return (
    <AlertDialog.Description
      {...props}
      class={twCx("text-base", props.class)}
    />
  );
}

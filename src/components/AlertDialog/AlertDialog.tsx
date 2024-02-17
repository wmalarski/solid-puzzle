import type { VariantProps } from "class-variance-authority";

import { AlertDialog } from "@kobalte/core";
import { type Component, type JSX, splitProps } from "solid-js";

import { buttonClass } from "../Button";
import { twCx } from "../utils/twCva";
import styles from "./AlertDialog.module.css";

export type AlertDialogRootProps = AlertDialog.AlertDialogRootProps;

export const AlertDialogRoot = AlertDialog.Root;

export type AlertDialogTriggerProps = AlertDialog.AlertDialogTriggerProps &
  VariantProps<typeof buttonClass>;

export const AlertDialogTrigger: Component<AlertDialogTriggerProps> = (
  props
) => {
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
};

export type AlertDialogPortalProps = AlertDialog.AlertDialogPortalProps;

export const AlertDialogPortal = AlertDialog.Portal;

export type AlertDialogOverlayProps = AlertDialog.AlertDialogOverlayProps;

export const AlertDialogOverlay: Component<AlertDialogOverlayProps> = (
  props
) => {
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
};

export type AlertDialogPositionerProps = JSX.IntrinsicElements["div"];

export const AlertDialogPositioner: Component<AlertDialogPositionerProps> = (
  props
) => {
  return (
    <div
      {...props}
      class={twCx(
        "fixed inset-0 z-50 flex items-center justify-center",
        props.class
      )}
    />
  );
};

export type AlertDialogContentProps = AlertDialog.AlertDialogContentProps;

export const AlertDialogContent: Component<AlertDialogContentProps> = (
  props
) => {
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
};

export type AlertDialogHeaderProps = JSX.IntrinsicElements["header"];

export const AlertDialogHeader: Component<AlertDialogHeaderProps> = (props) => {
  return (
    <header
      {...props}
      class={twCx("flex items-center justify-between mb-3", props.class)}
    />
  );
};

export type AlertDialogCloseButtonProps =
  AlertDialog.AlertDialogCloseButtonProps & VariantProps<typeof buttonClass>;

export const AlertDialogCloseButton: Component<AlertDialogCloseButtonProps> = (
  props
) => {
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
};

export type AlertDialogTitleProps = AlertDialog.AlertDialogTitleProps;

export const AlertDialogTitle: Component<AlertDialogTitleProps> = (props) => {
  return (
    <AlertDialog.Title
      {...props}
      class={twCx("text-xl font-medium", props.class)}
    />
  );
};

export type AlertDialogDescriptionProps =
  AlertDialog.AlertDialogDescriptionProps;

export const AlertDialogDescription: Component<AlertDialogDescriptionProps> = (
  props
) => {
  return (
    <AlertDialog.Description
      {...props}
      class={twCx("text-base", props.class)}
    />
  );
};

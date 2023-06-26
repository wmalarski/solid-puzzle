import { Dialog } from "@kobalte/core";
import type { VariantProps } from "class-variance-authority";
import { splitProps, type Component, type JSX } from "solid-js";
import { buttonClass } from "../Button";
import { twCx } from "../utils/twCva";
import styles from "./Dialog.module.css";

export type DialogRootProps = Dialog.DialogRootProps;

export const DialogRoot = Dialog.Root;

export type DialogTriggerProps = Dialog.DialogTriggerProps &
  VariantProps<typeof buttonClass>;

export const DialogTrigger: Component<DialogTriggerProps> = (props) => {
  const [split, rest] = splitProps(props, [
    "color",
    "isLoading",
    "shape",
    "size",
    "variant",
  ]);

  return (
    <Dialog.Trigger
      {...rest}
      class={buttonClass({ class: props.class, ...split })}
    />
  );
};

export type DialogPortalProps = Dialog.DialogPortalProps;

export const DialogPortal = Dialog.Portal;

export type DialogOverlayProps = Dialog.DialogOverlayProps;

export const DialogOverlay: Component<DialogOverlayProps> = (props) => {
  return (
    <Dialog.Overlay
      {...props}
      class={twCx(
        "fixed inset-0 z-50 bg-base-content bg-opacity-50",
        styles.overlay,
        props.class
      )}
    />
  );
};

export type DialogPositionerProps = JSX.IntrinsicElements["div"];

export const DialogPositioner: Component<DialogPositionerProps> = (props) => {
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

export type DialogContentProps = Dialog.DialogContentProps;

export const DialogContent: Component<DialogContentProps> = (props) => {
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
};

export type DialogHeaderProps = JSX.IntrinsicElements["header"];

export const DialogHeader: Component<DialogHeaderProps> = (props) => {
  return (
    <header
      {...props}
      class={twCx("flex items-baseline justify-between mb-3", props.class)}
    />
  );
};

export type DialogCloseButtonProps = Dialog.DialogCloseButtonProps;

export const DialogCloseButton: Component<DialogCloseButtonProps> = (props) => {
  return <Dialog.CloseButton {...props} class={twCx("w-4 h-4", props.class)} />;
};

export type DialogTitleProps = Dialog.DialogTitleProps;

export const DialogTitle: Component<DialogTitleProps> = (props) => {
  return (
    <Dialog.Title {...props} class={twCx("text-xl font-medium", props.class)} />
  );
};

export type DialogDescriptionProps = Dialog.DialogDescriptionProps;

export const DialogDescription: Component<DialogDescriptionProps> = (props) => {
  return (
    <Dialog.Description {...props} class={twCx("text-base", props.class)} />
  );
};

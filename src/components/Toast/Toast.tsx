import type { VariantProps } from "class-variance-authority";

import { Toast, toaster } from "@kobalte/core";
import { type ComponentProps, splitProps } from "solid-js";

import { AlertIcon, type AlertIconProps, alertClass } from "../Alert";
import { twCx } from "../utils/twCva";

const ToastRegion = Toast.Region;

function ToastList(props: Toast.ToastListProps) {
  return (
    <Toast.List
      {...props}
      class={twCx(
        "p-4 fixed bottom-0 right-0 flex flex-col gap-2 w-96 max-w-[100vw] m-0 list-none z-50 outline-none",
        props.class
      )}
    />
  );
}

export type ToastRootProps = Toast.ToastRootProps &
  VariantProps<typeof alertClass>;

export function ToastRoot(props: ToastRootProps) {
  const [split, rest] = splitProps(props, ["variant"]);

  return (
    <Toast.Root
      {...rest}
      class={alertClass({
        class: twCx(
          "flex items-start justify-between gap-2 p-3",
          "ui-opened:animate-slideIn ui-opened:duration-150 ui-opened:ease-out",
          "ui-closed:animate-hide ui-closed:duration-100 ui-closed:ease-in",
          "ui-swipe-move:translate-x-[var(--kb-toast-swipe-move-x)]",
          "ui-swipe-cancel:translate-x-0 ui-swipe-cancel:transition-transform",
          "ui-swipe-end:animate-swipeOut ui-swipe-end:duration-100 ui-swipe-end:ease-out",
          props.class
        ),
        ...split
      })}
    />
  );
}

export function ToastContent(props: ComponentProps<"div">) {
  return (
    <div
      {...props}
      class={twCx("flex flex-col items-start w-full", props.class)}
    />
  );
}

export function ToastCloseButton(props: Toast.ToastCloseButtonProps) {
  return (
    <Toast.CloseButton
      {...props}
      class={twCx("shrink-0 h-4 w-4 ml-auto", props.class)}
    />
  );
}

export function ToastTitle(props: Toast.ToastTitleProps) {
  return (
    <Toast.Title
      {...props}
      class={twCx("text-base font-medium", props.class)}
    />
  );
}

export function ToastDescription(props: Toast.ToastDescriptionProps) {
  return <Toast.Description {...props} class={twCx("text-sm", props.class)} />;
}

export function ToastProgressTrack(props: Toast.ToastProgressTrackProps) {
  return (
    <Toast.ProgressTrack
      {...props}
      class={twCx("h-2 w-full bg-accent", props.class)}
    />
  );
}

export function ToastProgressFill(props: Toast.ToastProgressFillProps) {
  return (
    <Toast.ProgressFill
      {...props}
      class={twCx(
        "bg-base-300 h-full",
        "w-[var(--kb-toast-progress-fill-width)] transition-[width] duration-200 ease-linear",
        props.class
      )}
    />
  );
}

export function ToastProvider() {
  return (
    <ToastRegion aria-label="Notifications">
      <ToastList />
    </ToastRegion>
  );
}

type ShowToastArgs = {
  description: string;
  title: string;
  variant: AlertIconProps["variant"];
};

export const showToast = ({ description, title, variant }: ShowToastArgs) => {
  toaster.show((props) => (
    <ToastRoot toastId={props.toastId} variant={variant}>
      <AlertIcon variant={variant} />
      <ToastContent>
        <ToastTitle>{title}</ToastTitle>
        <ToastDescription>{description}</ToastDescription>
      </ToastContent>
    </ToastRoot>
  ));
};

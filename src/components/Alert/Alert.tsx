import type { VariantProps } from "class-variance-authority";

import { type Component, type ComponentProps, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { AlertCircleIcon } from "../Icons/AlertCircleIcon";
import { CheckCircleIcon } from "../Icons/CheckCircleIcon";
import { InfoIcon } from "../Icons/InfoIcon";
import { XCircleIcon } from "../Icons/XCircleIcon";
import { twCva } from "../utils/twCva";

export const alertClass = twCva("alert justify-start", {
  defaultVariants: {
    variant: null
  },
  variants: {
    variant: {
      error: "alert-error",
      info: "alert-info",
      success: "alert-success",
      warning: "alert-warning"
    }
  }
});

export type AlertProps = ComponentProps<"div"> &
  VariantProps<typeof alertClass>;

export const Alert: Component<AlertProps> = (props) => {
  const [split, rest] = splitProps(props, ["variant"]);

  return <div {...rest} class={alertClass({ class: rest.class, ...split })} />;
};

const alertIconMap: Record<
  "error" | "info" | "success" | "warning",
  typeof CheckCircleIcon
> = {
  error: XCircleIcon,
  info: InfoIcon,
  success: CheckCircleIcon,
  warning: AlertCircleIcon
};

export type AlertIconProps = {
  variant: keyof typeof alertIconMap;
};

export const AlertIcon: Component<AlertIconProps> = (props) => {
  const component = () => {
    return alertIconMap[props.variant];
  };
  return (
    <Dynamic class="size-6 shrink-0 stroke-current" component={component()} />
  );
};

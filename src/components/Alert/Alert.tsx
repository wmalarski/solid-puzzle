import type { VariantProps } from "class-variance-authority";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineExclamationTriangle,
  HiOutlineInformationCircle,
} from "solid-icons/hi";
import { splitProps, type Component, type JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import { twCva } from "../utils/twCva";

export const alertClass = twCva("alert justify-start", {
  defaultVariants: {
    variant: null,
  },
  variants: {
    variant: {
      error: "alert-error",
      info: "alert-info",
      success: "alert-success",
      warning: "alert-warning",
    },
  },
});

export type AlertProps = JSX.IntrinsicElements["div"] &
  VariantProps<typeof alertClass>;

export const Alert: Component<AlertProps> = (props) => {
  const [split, rest] = splitProps(props, ["variant"]);

  return <div {...rest} class={alertClass({ class: rest.class, ...split })} />;
};

const alertIconMap: Record<
  "error" | "info" | "success" | "warning",
  typeof HiOutlineCheckCircle
> = {
  error: HiOutlineExclamationCircle,
  info: HiOutlineInformationCircle,
  success: HiOutlineCheckCircle,
  warning: HiOutlineExclamationTriangle,
};

export type AlertIconProps = {
  variant: keyof typeof alertIconMap;
};

export const AlertIcon: Component<AlertIconProps> = (props) => {
  const component = () => {
    return alertIconMap[props.variant];
  };
  return (
    <Dynamic component={component()} class="h-6 w-6 shrink-0 stroke-current" />
  );
};

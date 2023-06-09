import { Tooltip } from "@kobalte/core";
import type { VariantProps } from "class-variance-authority";
import { splitProps, type Component } from "solid-js";
import { buttonClass } from "../Button";
import { twCx } from "../utils/twCva";
import styles from "./Tooltip.module.css";

export type TooltipRootProps = Tooltip.TooltipRootProps;

export const TooltipRoot: Component<TooltipRootProps> = Tooltip.Root;

export type TooltipTriggerProps = Tooltip.TooltipTriggerProps &
  VariantProps<typeof buttonClass>;

export const TooltipTrigger: Component<TooltipTriggerProps> = (props) => {
  const [split, rest] = splitProps(props, [
    "color",
    "isLoading",
    "shape",
    "size",
    "variant",
  ]);

  return (
    <Tooltip.Trigger
      {...rest}
      class={buttonClass({ class: props.class, ...split })}
    />
  );
};

export type TooltipPortalProps = Tooltip.TooltipPortalProps;

export const TooltipPortal: Component<TooltipPortalProps> = Tooltip.Portal;

export type TooltipContentProps = Tooltip.TooltipContentProps;

export const TooltipContent: Component<TooltipContentProps> = (props) => {
  return (
    <Tooltip.Content
      {...props}
      class={twCx(
        "z-50 py-1 px-2 rounded-lg text-sm shadow",
        styles.content,
        props.class
      )}
    />
  );
};

export type TooltipArrowProps = Tooltip.TooltipArrowProps;

export const TooltipArrow: Component<TooltipArrowProps> = (props) => {
  return <Tooltip.Arrow {...props} class={twCx("", props.class)} />;
};

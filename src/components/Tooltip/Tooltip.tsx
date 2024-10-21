import type { VariantProps } from "class-variance-authority";

import { Tooltip } from "@kobalte/core";
import { Component, ComponentProps, splitProps } from "solid-js";

import { buttonSplitProps } from "../Button/Button";
import { buttonClass } from "../Button/Button.recipe";
import { twCx } from "../utils/twCva";
import styles from "./Tooltip.module.css";

export type TooltipRootProps = ComponentProps<typeof Tooltip.Root>;

export const TooltipRoot = Tooltip.Root;

export type TooltipTriggerProps = ComponentProps<typeof Tooltip.Trigger> &
  VariantProps<typeof buttonClass>;

export const TooltipTrigger: Component<TooltipTriggerProps> = (props) => {
  const [split, rest] = splitProps(props, buttonSplitProps);

  return <Tooltip.Trigger {...rest} class={buttonClass(split)} />;
};

export type TooltipPortalProps = ComponentProps<typeof Tooltip.Portal>;

export const TooltipPortal = Tooltip.Portal;

export type TooltipContentProps = ComponentProps<typeof Tooltip.Content>;

export const TooltipContent: Component<TooltipContentProps> = (props) => {
  return (
    <Tooltip.Content
      {...props}
      class={twCx(
        "z-50 py-1 px-2 rounded-lg text-sm shadow bg-base-300",
        styles.content,
        props.class
      )}
    />
  );
};

export type TooltipArrowProps = ComponentProps<typeof Tooltip.Arrow>;

export const TooltipArrow: Component<TooltipArrowProps> = (props) => {
  return <Tooltip.Arrow {...props} class={twCx("", props.class)} />;
};

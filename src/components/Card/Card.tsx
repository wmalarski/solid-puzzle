import type { VariantProps } from "class-variance-authority";
import {
  splitProps,
  type Component,
  type JSX,
  type ValidComponent,
} from "solid-js";
import { Dynamic, type DynamicProps } from "solid-js/web";
import { twCva, twCx } from "../utils/twCva";

export const cardClass = twCva("card", {
  defaultVariants: {
    bg: null,
    color: null,
    size: null,
    variant: null,
  },
  variants: {
    bg: {
      "gray-100": "bg-gray-100",
      "gray-50": "bg-gray-50",
    },
    color: {
      accent: "border-l-8 border-l-accent",
      black: "border-l-8 border-l-neutral",
      disabled: "border-l-8 border-l-base-200",
      error: "border-l-8 border-l-error",
      info: "border-l-8 border-l-info",
      primary: "border-l-8 border-l-primary",
      secondary: "border-l-8 border-l-secondary",
      success: "border-l-8 border-l-success",
      warning: "border-l-8 border-l-warning",
    },
    size: {
      compact: "card-compact",
      normal: "card-normal",
      side: "card-side",
    },
    variant: {
      bordered: "card-bordered",
    },
  },
});

export type CardProps = JSX.IntrinsicElements["div"] &
  VariantProps<typeof cardClass>;

export const Card: Component<CardProps> = (props) => {
  const [split, rest] = splitProps(props, ["variant", "size", "color", "bg"]);

  return <div {...rest} class={cardClass({ class: props.class, ...split })} />;
};

export const cardTitleClass = twCva("card-title");

export type CardTitleProps<T extends ValidComponent> = DynamicProps<T>;

export function CardTitle<T extends ValidComponent>(props: CardTitleProps<T>) {
  return (
    <Dynamic
      {...props}
      component={props.component}
      class={cardTitleClass({ class: props.class })}
    />
  );
}

export type CardBodyProps = JSX.IntrinsicElements["div"];

export function CardBody(props: CardBodyProps) {
  return <div {...props} class={twCx("card-body", props.class)} />;
}

export type CardActionsProps = JSX.IntrinsicElements["div"];

export const CardActions: Component<CardActionsProps> = (props) => {
  return <div {...props} class={twCx("card-actions", props.class)} />;
};

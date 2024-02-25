import type { VariantProps } from "class-variance-authority";

import {
  type Component,
  type ComponentProps,
  type ValidComponent,
  splitProps
} from "solid-js";
import { Dynamic, type DynamicProps } from "solid-js/web";

import { twCva, twCx } from "../utils/twCva";

export const cardClass = twCva("card", {
  defaultVariants: {
    bg: null,
    color: null,
    size: null,
    variant: null
  },
  variants: {
    bg: {
      "base-100": "bg-base-100",
      "base-200": "bg-base-200",
      "base-300": "bg-base-300"
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
      warning: "border-l-8 border-l-warning"
    },
    size: {
      compact: "card-compact",
      normal: "card-normal",
      side: "card-side"
    },
    variant: {
      bordered: "card-bordered"
    }
  }
});

export type CardProps = ComponentProps<"div"> & VariantProps<typeof cardClass>;

export function Card(props: CardProps) {
  const [split, rest] = splitProps(props, ["variant", "size", "color", "bg"]);

  return <div {...rest} class={cardClass({ class: props.class, ...split })} />;
}

export const cardTitleClass = twCva("card-title");

export type CardTitleProps<T extends ValidComponent> = DynamicProps<T>;

export function CardTitle<T extends ValidComponent>(props: CardTitleProps<T>) {
  return (
    <Dynamic
      {...props}
      class={cardTitleClass({ class: props.class })}
      component={props.component}
    />
  );
}

export type CardBodyProps = ComponentProps<"div">;

export function CardBody(props: CardBodyProps) {
  return <div {...props} class={twCx("card-body", props.class)} />;
}

export const cardActionsClass = twCva("card-actions", {
  defaultVariants: {
    justify: null
  },
  variants: {
    justify: {
      end: "justify-end"
    }
  }
});

export type CardActionsProps = ComponentProps<"div"> &
  VariantProps<typeof cardActionsClass>;

export function CardActions(props: CardActionsProps) {
  const [split, rest] = splitProps(props, ["justify"]);

  return (
    <div {...rest} class={cardActionsClass({ class: props.class, ...split })} />
  );
}

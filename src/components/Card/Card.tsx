import type { VariantProps } from "class-variance-authority";

import {
  Component,
  type ComponentProps,
  splitProps,
  type ValidComponent
} from "solid-js";
import { Dynamic, type DynamicProps } from "solid-js/web";

import { twCx } from "../utils/twCva";
import { cardActionsRecipe, cardRecipe, cardTitleRecipe } from "./Card.recipe";

export type CardProps = ComponentProps<"div"> & VariantProps<typeof cardRecipe>;

export const Card: Component<CardProps> = (props) => {
  const [split, rest] = splitProps(props, ["variant", "size", "color", "bg"]);

  return <div {...rest} class={cardRecipe({ class: props.class, ...split })} />;
};

export type CardTitleProps<T extends ValidComponent> = DynamicProps<T>;

export function CardTitle<T extends ValidComponent>(props: CardTitleProps<T>) {
  return (
    <Dynamic
      {...props}
      class={cardTitleRecipe({ class: props.class })}
      component={props.component}
    />
  );
}

export type CardBodyProps = ComponentProps<"div">;

export const CardBody: Component<CardBodyProps> = (props) => {
  return <div {...props} class={twCx("card-body", props.class)} />;
};

export type CardActionsProps = ComponentProps<"div"> &
  VariantProps<typeof cardActionsRecipe>;

export const CardActions: Component<CardActionsProps> = (props) => {
  const [split, rest] = splitProps(props, ["justify"]);

  return (
    <div
      {...rest}
      class={cardActionsRecipe({ class: props.class, ...split })}
    />
  );
};

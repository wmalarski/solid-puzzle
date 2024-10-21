import type { VariantProps } from "class-variance-authority";

import { Component, type ComponentProps, splitProps } from "solid-js";

import { twCx } from "../utils/twCva";
import { carouselClass } from "./Carousel.recipe";

export type CarouselProps = ComponentProps<"div"> &
  VariantProps<typeof carouselClass>;

export const Carousel: Component<CarouselProps> = (props) => {
  const [split, rest] = splitProps(props, ["isVertical", "snap"]);

  return (
    <div {...rest} class={carouselClass({ class: props.class, ...split })} />
  );
};

export type CarouselItemProps = ComponentProps<"div">;

export const CarouselItem: Component<CarouselItemProps> = (props) => {
  return <div {...props} class={twCx("carousel-item", props.class)} />;
};

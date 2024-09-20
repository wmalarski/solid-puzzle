import type { VariantProps } from "class-variance-authority";

import { type ComponentProps, splitProps } from "solid-js";

import { twCx } from "../utils/twCva";
import { carouselClass } from "./Carousel.recipe";

export type CarouselProps = ComponentProps<"div"> &
  VariantProps<typeof carouselClass>;

export function Carousel(props: CarouselProps) {
  const [split, rest] = splitProps(props, ["isVertical", "snap"]);

  return (
    <div {...rest} class={carouselClass({ class: props.class, ...split })} />
  );
}

export type CarouselItemProps = ComponentProps<"div">;

export function CarouselItem(props: CarouselItemProps) {
  return <div {...props} class={twCx("carousel-item", props.class)} />;
}

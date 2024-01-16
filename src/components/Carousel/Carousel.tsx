import type { VariantProps } from "class-variance-authority";

import { type Component, type ComponentProps, splitProps } from "solid-js";

import { twCva, twCx } from "../utils/twCva";

export const carouselClass = twCva("carousel", {
  defaultVariants: {
    isVertical: null,
    snap: null
  },
  variants: {
    isVertical: {
      true: "carousel-vertical"
    },
    snap: {
      center: "carousel-center",
      end: "carousel-end"
    }
  }
});

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

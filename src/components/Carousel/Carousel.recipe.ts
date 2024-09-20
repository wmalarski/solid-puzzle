import { twCva } from "../utils/twCva";

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

import type { JSX } from "solid-js";
import arrowRightIcon from "./resources/arrow-right-icon.svg";

export const ArrowRightIcon = (props: JSX.IntrinsicElements["img"]) => {
  return <img src={arrowRightIcon} alt="ArrowRight" {...props} />;
};

import type { JSX } from "solid-js";
import arrowLeftIcon from "./resources/arrow-left-icon.svg";

export const ArrowLeftIcon = (props: JSX.IntrinsicElements["img"]) => {
  return <img src={arrowLeftIcon} alt="arrowLeft" {...props} />;
};

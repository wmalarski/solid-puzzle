import type { JSX } from "solid-js";
import minusIcon from "./resources/minus-icon.svg";

export const MinusIcon = (props: JSX.IntrinsicElements["img"]) => {
  return <img src={minusIcon} alt="minus" {...props} />;
};

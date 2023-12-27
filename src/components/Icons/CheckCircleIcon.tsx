import type { JSX } from "solid-js";
import checkCircleIcon from "./resources/check-circle-icon.svg";

export const CheckCircleIcon = (props: JSX.IntrinsicElements["img"]) => {
  return <img src={checkCircleIcon} alt="checkCircle" {...props} />;
};

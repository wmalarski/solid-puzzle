import type { JSX } from "solid-js";
import alertCircleIcon from "./resources/alert-circle-icon.svg";

export const AlertCircleIcon = (props: JSX.IntrinsicElements["img"]) => {
  return <img src={alertCircleIcon} alt="alertCircle" {...props} />;
};

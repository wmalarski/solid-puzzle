import type { JSX } from "solid-js";
import xCircleIcon from "./resources/x-circle-icon.svg";

export const XCircleIcon = (props: JSX.IntrinsicElements["img"]) => {
  return <img src={xCircleIcon} alt="xCircle" {...props} />;
};

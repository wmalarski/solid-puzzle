import type { JSX } from "solid-js";
import xIcon from "./resources/x-icon.svg";

export const XIcon = (props: JSX.IntrinsicElements["img"]) => {
  return <img src={xIcon} alt="x" {...props} />;
};

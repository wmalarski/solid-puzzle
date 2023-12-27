import type { JSX } from "solid-js";
import plusIcon from "./resources/plus-icon.svg";

export const PlusIcon = (props: JSX.IntrinsicElements["img"]) => {
  return <img src={plusIcon} alt="plus" {...props} />;
};

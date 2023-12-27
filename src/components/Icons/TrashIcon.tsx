import type { JSX } from "solid-js";
import trashIcon from "./resources/trash-icon.svg";

export const TrashIcon = (props: JSX.IntrinsicElements["img"]) => {
  return <img src={trashIcon} alt="trash" {...props} />;
};

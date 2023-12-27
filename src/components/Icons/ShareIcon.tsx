import type { JSX } from "solid-js";
import shareIcon from "./resources/share-icon.svg";

export const ShareIcon = (props: JSX.IntrinsicElements["img"]) => {
  return <img src={shareIcon} alt="share" {...props} />;
};

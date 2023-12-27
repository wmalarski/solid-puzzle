import type { JSX } from "solid-js";
import infoIcon from "./resources/info-icon.svg";

export const InfoIcon = (props: JSX.IntrinsicElements["img"]) => {
  return <img src={infoIcon} alt="info" {...props} />;
};

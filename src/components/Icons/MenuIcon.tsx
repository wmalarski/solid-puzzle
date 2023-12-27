import type { JSX } from "solid-js";
import menuIcon from "./resources/menu-icon.svg";

export const MenuIcon = (props: JSX.IntrinsicElements["img"]) => {
  return <img src={menuIcon} alt="menu" {...props} />;
};

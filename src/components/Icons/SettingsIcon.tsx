import type { JSX } from "solid-js";
import settingsIcon from "./resources/settings-icon.svg";

export const SettingsIcon = (props: JSX.IntrinsicElements["img"]) => {
  return <img src={settingsIcon} alt="settings" {...props} />;
};

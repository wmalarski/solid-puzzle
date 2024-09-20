import { twCva } from "../utils/twCva";
import styles from "./DropdownMenu.module.css";

export const dropdownMenuIconClass = twCva("rotate-0 duration-200", {
  defaultVariants: {
    rotation: 0
  },
  variants: {
    rotation: {
      0: "",
      90: "ui-expanded:rotate-90",
      180: "ui-expanded:rotate-180"
    }
  }
});

export const dropdownMenuContentClass = twCva([
  "min-w-[220px] p-2 bg-base-100 rounded-2xl shadow outline-none",
  styles.content
]);

export const dropdownMenuItemClass = twCva([
  "relative flex select-none items-center p-2 text-base-content leading-none rounded-2xl outline-none",
  "ui-disabled:opacity-50 ui-disabled:pointer-events-none",
  "ui-highlighted:outline-none ui-highlighted:bg-base-200"
]);

export const dropdownMenuSubTriggerClass = twCva([
  dropdownMenuItemClass,
  "ui-expanded:bg-base-100 ui-expanded:text-accent-content"
]);

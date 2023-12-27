import type { JSX } from "solid-js";
import puzzleIcon from "./resources/puzzle-icon.svg";

export const PuzzleIcon = (props: JSX.IntrinsicElements["img"]) => {
  return <img src={puzzleIcon} alt="puzzle" {...props} />;
};

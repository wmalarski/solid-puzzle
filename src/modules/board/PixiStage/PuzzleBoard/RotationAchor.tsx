import * as PIXI from "pixi.js";
import { onCleanup, onMount, type Component } from "solid-js";
import type { PuzzleFragmentShape } from "./getPuzzleFragments";

type RotationAnchorProps = {
  container: PIXI.Container;
  shape: PuzzleFragmentShape;
};

export const RotationAnchor: Component<RotationAnchorProps> = (props) => {
  const graphics = new PIXI.Graphics();

  onMount(() => {
    graphics.drawCircle(props.shape.center.x, props.shape.center.y, 10);
  });

  onMount(() => {
    props.container.addChild(graphics);
  });

  onCleanup(() => {
    props.container.removeChild(graphics);
    graphics.destroy();
  });

  return null;
};

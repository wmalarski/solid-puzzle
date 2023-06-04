import * as PIXI from "pixi.js";
import { onCleanup, onMount, type Component } from "solid-js";
import type { FragmentState } from "./PuzzleStore";
import type { PuzzleFragmentShape } from "./getPuzzleFragments";
import { useDragObject } from "./useDragObject";

type RotationAnchorProps = {
  container: PIXI.Container;
  fragmentState: FragmentState;
  shape: PuzzleFragmentShape;
};

const rotationAnchorDistance = 30;
const rotationAnchorRadius = 10;

export const RotationAnchor: Component<RotationAnchorProps> = (props) => {
  const graphics = new PIXI.Graphics();
  graphics.eventMode = "static";
  graphics.tint = "blue";

  onMount(() => {
    const rotation = props.fragmentState.rotation;
    const xShift = rotationAnchorDistance * Math.sin(rotation);
    const yShift = rotationAnchorDistance * Math.cos(rotation);

    graphics.beginFill();
    graphics.drawCircle(
      props.shape.center.x + xShift,
      props.shape.center.y + yShift,
      rotationAnchorRadius
    );
    graphics.endFill();
  });

  useDragObject({ displayObject: graphics });

  onMount(() => {
    props.container.addChild(graphics);
  });

  onCleanup(() => {
    props.container.removeChild(graphics);
    graphics.destroy();
  });

  return null;
};

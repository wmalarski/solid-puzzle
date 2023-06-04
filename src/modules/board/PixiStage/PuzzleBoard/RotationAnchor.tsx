import * as PIXI from "pixi.js";
import { createMemo, onCleanup, onMount, type Component } from "solid-js";
import { getClosestPoint, solveCircleLine } from "~/utils/geometry";
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

  const anchorPosition = createMemo(() => {
    const rotation = props.fragmentState.rotation;
    const xShift = rotationAnchorDistance * Math.sin(rotation);
    const yShift = rotationAnchorDistance * Math.cos(rotation);
    return {
      x: props.shape.center.x + xShift,
      y: props.shape.center.y + yShift,
    };
  });

  onMount(() => {
    const position = anchorPosition();

    graphics.beginFill();
    graphics.drawCircle(position.x, position.y, rotationAnchorRadius);
    graphics.endFill();
  });

  useDragObject({
    displayObject: graphics,
    dragConstraint: ({ eventPosition, shift }) => {
      const points = solveCircleLine({
        center: props.shape.center,
        point: eventPosition,
        radius: rotationAnchorDistance,
      });

      const closest = getClosestPoint({
        from: eventPosition,
        points,
      });

      return { x: closest.x - shift.x, y: closest.y - shift.y };
    },
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

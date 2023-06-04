import * as PIXI from "pixi.js";
import { createMemo, onCleanup, onMount, type Component } from "solid-js";
import { crossPoints, lineFromPoints } from "~/utils/geometry";
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
      const anchor = anchorPosition();

      //
      const result = {
        x: eventPosition.x - shift.x,
        y: eventPosition.y - shift.y,
      };

      const line = lineFromPoints({
        p1: props.shape.center,
        p2: eventPosition,
      });

      const points = crossPoints({
        center: props.shape.center,
        line,
        radius: rotationAnchorDistance,
      });

      console.log(
        JSON.stringify(
          {
            anchor,
            centerX: props.shape.center.x,
            centerY: props.shape.center.y,
            line,
            points,
            positionX: eventPosition.x,
            positionY: eventPosition.y,
            result,
            shift,
          },
          null,
          2
        )
      );

      return result;
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

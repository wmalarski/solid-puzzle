import * as PIXI from "pixi.js";
import { createEffect, onCleanup, onMount, type Component } from "solid-js";
import { usePuzzleStoreContext, type FragmentState } from "./PuzzleStore";
import type { PuzzleFragmentShape } from "./getPuzzleFragments";

type RotationAnchorProps = {
  container: PIXI.Container;
  fragmentState: FragmentState;
  shape: PuzzleFragmentShape;
};

const rotationAnchorDistance = 30;
const rotationAnchorRadius = 10;

export const RotationAnchor: Component<RotationAnchorProps> = (props) => {
  const store = usePuzzleStoreContext();

  const graphics = new PIXI.Graphics();
  graphics.eventMode = "static";
  graphics.tint = "blue";

  onMount(() => {
    const rotation = props.fragmentState.rotation;
    const x = rotationAnchorDistance * Math.sin(-rotation);
    const y = rotationAnchorDistance * Math.cos(rotation);

    graphics.beginFill();
    graphics.drawCircle(x, y, rotationAnchorRadius);
    graphics.endFill();
  });

  createEffect(() => {
    graphics.rotation = props.fragmentState.rotation;
  });

  const onDragMove = (event: PIXI.FederatedPointerEvent) => {
    const local = props.container.toLocal(event.global);
    store.setRotation({
      fragmentId: props.shape.fragmentId,
      rotation: Math.atan2(-local.x, local.y),
    });
  };

  const onDragEnd = () => {
    props.container.off("pointermove", onDragMove);
    props.container.off("pointerup", onDragEnd);
    props.container.off("pointerupoutside", onDragEnd);
  };

  const onPointerDown = (event: PIXI.FederatedMouseEvent) => {
    if (event.button === 2) {
      return;
    }

    event.stopPropagation();
    props.container.on("pointermove", onDragMove);
    props.container.once("pointerup", onDragEnd);
    props.container.once("pointerupoutside", onDragEnd);
  };

  onMount(() => {
    props.container.addChild(graphics);
    graphics.on("pointerdown", onPointerDown);
  });

  onCleanup(() => {
    props.container.removeChild(graphics);
    graphics.off("pointerdown", onPointerDown);
    graphics.destroy();
  });

  return null;
};

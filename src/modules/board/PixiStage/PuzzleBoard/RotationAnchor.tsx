import * as PIXI from "pixi.js";
import { createEffect, onCleanup, onMount, type Component } from "solid-js";
import { usePixiApp } from "../PixiApp";
import {
  findCloseNeighbor,
  usePuzzleStoreContext,
  type FragmentState,
} from "./PuzzleStore";
import type { PuzzleFragmentShape } from "./getPuzzleFragments";

type RotationAnchorProps = {
  container: PIXI.Container;
  islandId: string;
  fragmentState: FragmentState;
  shape: PuzzleFragmentShape;
};

const rotationAnchorDistance = 30;
const rotationAnchorRadius = 10;

export const RotationAnchor: Component<RotationAnchorProps> = (props) => {
  const app = usePixiApp();
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

  const onDragEnd = (event: PIXI.FederatedPointerEvent) => {
    app().stage.off("pointermove", onDragMove);
    app().stage.off("pointerup", onDragEnd);
    app().stage.off("pointerupoutside", onDragEnd);

    const local = props.container.toLocal(event.global);
    const fragmentPosition = {
      rotation: Math.atan2(-local.x, local.y),
      x: props.container.x,
      y: props.container.y,
    };

    const toConnect = findCloseNeighbor({
      fragment: fragmentPosition,
      fragments: store.state.fragments,
      neighbors: props.shape.neighbors,
    });

    if (toConnect) {
      store.addConnection({
        fragmentId: toConnect.id,
        islandId: props.islandId,
      });
    }
  };

  const onPointerDown = (event: PIXI.FederatedMouseEvent) => {
    if (event.button === 2) {
      return;
    }

    event.stopPropagation();
    app().stage.on("pointermove", onDragMove);
    app().stage.once("pointerup", onDragEnd);
    app().stage.once("pointerupoutside", onDragEnd);
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

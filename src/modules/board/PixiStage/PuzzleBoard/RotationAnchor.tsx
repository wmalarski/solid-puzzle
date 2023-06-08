import * as PIXI from "pixi.js";
import { createEffect, onCleanup, onMount, type Component } from "solid-js";
import { usePixiApp } from "../PixiApp";

type RotationAnchorProps = {
  container: PIXI.Container;
  rotation: number;
  onRotate: (rotation: number) => void;
  onEnd: (rotation: number) => void;
};

const rotationAnchorRadius = 10;

export const RotationAnchor: Component<RotationAnchorProps> = (props) => {
  const app = usePixiApp();

  const graphics = new PIXI.Graphics();
  graphics.eventMode = "static";
  graphics.tint = "blue";

  onMount(() => {
    const radius = Math.max(props.container.width, props.container.height);
    const x = radius * Math.cos(props.rotation);
    const y = radius * Math.sin(props.rotation);

    console.log("MOUNT", props.rotation, x, y);

    graphics.beginFill();
    graphics.drawCircle(x, y, rotationAnchorRadius);
    graphics.endFill();
  });

  createEffect(() => {
    console.log("ANCHOR", props.rotation);
    graphics.rotation = props.rotation;
  });

  const toRotation = (event: PIXI.FederatedPointerEvent) => {
    const local = props.container.toLocal(event.global);
    console.log("TO_ROTATION", local.x, local.y);
    return -Math.atan2(local.x, local.y);
  };

  const onDragMove = (event: PIXI.FederatedPointerEvent) => {
    const rotation = toRotation(event);
    console.log("MOVE", rotation);
    props.onRotate(rotation);
  };

  const onDragEnd = (event: PIXI.FederatedPointerEvent) => {
    app().stage.off("pointermove", onDragMove);
    app().stage.off("pointerup", onDragEnd);
    app().stage.off("pointerupoutside", onDragEnd);

    const rotation = toRotation(event);
    console.log("END", rotation);
    props.onEnd(rotation);
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

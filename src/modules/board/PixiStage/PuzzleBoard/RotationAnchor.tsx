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
    const radius = Math.max(props.container.width, props.container.height) / 2;
    const x = 0;
    const y = -radius;

    graphics.beginFill();
    graphics.drawCircle(x, y, rotationAnchorRadius);
    graphics.endFill();
    // graphics.pivot.set(props.container.width / 2, props.container.height / 2);
  });

  createEffect(() => {
    graphics.rotation = props.rotation;
  });

  const toRotation = (event: PIXI.FederatedPointerEvent) => {
    const local = props.container.toLocal(event.global);
    return Math.atan2(local.y, local.x) + Math.PI / 2;
  };

  const onDragMove = (event: PIXI.FederatedPointerEvent) => {
    const rotation = toRotation(event);
    props.onRotate(rotation);
  };

  const onDragEnd = (event: PIXI.FederatedPointerEvent) => {
    app().stage.off("pointermove", onDragMove);
    app().stage.off("pointerup", onDragEnd);
    app().stage.off("pointerupoutside", onDragEnd);

    const rotation = toRotation(event);
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

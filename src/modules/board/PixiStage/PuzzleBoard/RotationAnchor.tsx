import {
  Graphics,
  type Container,
  type FederatedMouseEvent,
  type FederatedPointerEvent,
} from "pixi.js";
import { createEffect, onCleanup, onMount, type Component } from "solid-js";
import { usePixiContainer } from "../PixiApp";

type RotationAnchorProps = {
  container: Container;
  rotation: number;
  onRotate: (rotation: number) => void;
  onEnd: (rotation: number) => void;
};

const rotationAnchorRadius = 10;

export const RotationAnchor: Component<RotationAnchorProps> = (props) => {
  const container = usePixiContainer();

  const graphics = new Graphics();
  graphics.eventMode = "static";

  onMount(() => {
    const radius = Math.max(props.container.width, props.container.height) / 2;
    const x = 0;
    const y = -radius;

    graphics.circle(x, y, rotationAnchorRadius).fill({ color: "0xff0000" });
  });

  createEffect(() => {
    graphics.rotation = props.rotation;
  });

  const toRotation = (event: FederatedPointerEvent) => {
    const local = props.container.toLocal(event.global);
    return Math.atan2(local.y, local.x) + Math.PI / 2;
  };

  const onDragMove = (event: FederatedPointerEvent) => {
    const rotation = toRotation(event);
    props.onRotate(rotation);
  };

  const onDragEnd = (event: FederatedPointerEvent) => {
    container.off("pointermove", onDragMove);
    container.off("pointerup", onDragEnd);
    container.off("pointerupoutside", onDragEnd);

    const rotation = toRotation(event);
    props.onEnd(rotation);
  };

  const onPointerDown = (event: FederatedMouseEvent) => {
    if (event.button === 2) {
      return;
    }

    event.stopPropagation();
    container.on("pointermove", onDragMove);
    container.once("pointerup", onDragEnd);
    container.once("pointerupoutside", onDragEnd);
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

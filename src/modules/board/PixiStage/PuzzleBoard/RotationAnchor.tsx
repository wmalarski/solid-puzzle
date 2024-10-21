import {
  type Container,
  type FederatedMouseEvent,
  type FederatedPointerEvent,
  Graphics
} from "pixi.js";
import { createEffect, onCleanup, onMount } from "solid-js";

import { usePlayerPresence } from "../../DataProviders/PresenceProvider";
import { useBoardTheme } from "../BoardTheme";
import { RIGHT_BUTTON } from "../constants";
import { usePixiApp, usePixiContainer } from "../PixiApp";

type RotationAnchorProps = {
  container: Container;
  onEnd: (rotation: number) => void;
  onRotate: (rotation: number) => void;
  rotation: number;
  rotationOffset: number;
};

export function RotationAnchor(props: RotationAnchorProps) {
  const app = usePixiApp();
  const theme = useBoardTheme();
  const container = usePixiContainer();

  const presence = usePlayerPresence();

  const graphics = new Graphics();
  graphics.eventMode = "static";

  onMount(() => {
    const radius = Math.max(props.container.width, props.container.height) / 2;
    const x = 0;
    const y = -radius;
    const color = presence().currentPlayer.color;

    graphics.circle(0, 0, radius).stroke({ color });
    graphics.circle(x, y, theme.rotationAnchorRadius).fill({ color }).stroke({
      color: theme.rotationAnchorColor,
      width: theme.rotationAnchorWidth
    });
  });

  createEffect(() => {
    graphics.rotation = props.rotation + props.rotationOffset;
  });

  const toRotation = (event: FederatedPointerEvent) => {
    const local = props.container.toLocal(event.global);
    return Math.atan2(local.y, local.x) + Math.PI / 2 - props.rotationOffset;
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

    app.canvas.style.cursor = "default";
  };

  const onPointerDown = (event: FederatedMouseEvent) => {
    if (event.button === RIGHT_BUTTON) {
      return;
    }

    event.stopPropagation();
    container.on("pointermove", onDragMove);
    container.once("pointerup", onDragEnd);
    container.once("pointerupoutside", onDragEnd);

    app.canvas.style.cursor = "grab";
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
}

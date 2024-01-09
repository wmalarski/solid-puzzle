import {
  Graphics,
  type Container,
  type FederatedMouseEvent,
  type FederatedPointerEvent,
} from "pixi.js";
import { createEffect, onCleanup, onMount, type Component } from "solid-js";
import { useBoardTheme } from "../BoardTheme";
import { usePixiApp } from "../PixiApp";
import { RIGHT_BUTTON } from "../constants";

type RotationAnchorProps = {
  container: Container;
  rotation: number;
  rotationOffset: number;
  onRotate: (rotation: number) => void;
  onEnd: (rotation: number) => void;
};

export const RotationAnchor: Component<RotationAnchorProps> = (props) => {
  const app = usePixiApp();
  const theme = useBoardTheme();

  const graphics = new Graphics();
  graphics.eventMode = "static";

  onMount(() => {
    const radius = Math.max(props.container.width, props.container.height) / 4;
    const x = 0;
    const y = -radius;

    graphics
      .circle(x, y, theme.rotationAnchorRadius)
      .fill({ color: theme.rotationAnchorColor });
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
    app.stage.off("pointermove", onDragMove);
    app.stage.off("pointerup", onDragEnd);
    app.stage.off("pointerupoutside", onDragEnd);

    const rotation = toRotation(event);
    props.onEnd(rotation);
  };

  const onPointerDown = (event: FederatedMouseEvent) => {
    if (event.button === RIGHT_BUTTON) {
      return;
    }

    event.stopPropagation();
    app.stage.on("pointermove", onDragMove);
    app.stage.once("pointerup", onDragEnd);
    app.stage.once("pointerupoutside", onDragEnd);
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

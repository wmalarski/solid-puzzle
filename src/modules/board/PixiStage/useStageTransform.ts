import type * as PIXI from "pixi.js";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import type { Point2D } from "~/utils/geometry";
import { useTransformContext } from "../TransformContext";
import { usePixiApp } from "./PixiApp";

export const useZoom = () => {
  const app = usePixiApp();
  const transform = useTransformContext();

  createEffect(() => {
    app().stage.transform.scale.set(transform.scale());
    app().stage.transform.position.set(transform.x(), transform.y());
  });
};

export const usePane = () => {
  const app = usePixiApp();
  const transform = useTransformContext();

  const [origin, setOrigin] = createSignal<Point2D>();
  const [start, setStart] = createSignal<Point2D>({ x: 0, y: 0 });

  const onPointerDown = (event: PIXI.FederatedPointerEvent) => {
    if (event.button !== 2) {
      return;
    }

    setOrigin({ x: event.x, y: event.y });
    setStart({ x: transform.x(), y: transform.y() });
  };

  onMount(() => {
    app().stage.on("pointerdown", onPointerDown);
  });

  onCleanup(() => {
    app().stage.off("pointerdown", onPointerDown);
  });

  createEffect(() => {
    const originPosition = origin();
    if (!originPosition) {
      return;
    }

    const onPointerMove = (event: PIXI.FederatedPointerEvent) => {
      const startPosition = start();
      transform.setX(startPosition.x - originPosition.x + event.x);
      transform.setY(startPosition.y - originPosition.y + event.y);
    };

    const onDragEnd = () => {
      app().stage.off("pointermove", onPointerMove);
      setOrigin();
    };

    onMount(() => {
      app().stage.on("pointermove", onPointerMove);
      app().stage.on("pointerup", onDragEnd);
      app().stage.on("pointerupoutside", onDragEnd);
    });

    onCleanup(() => {
      app().stage.off("pointermove", onPointerMove);
      app().stage.off("pointerup", onDragEnd);
      app().stage.off("pointerupoutside", onDragEnd);
    });
  });
};

export const useWheel = () => {
  const app = usePixiApp();
  const transform = useTransformContext();

  const onWheel = (event: PIXI.FederatedWheelEvent) => {
    const point = { x: event.globalX, y: event.globalY };
    if (event.deltaY < 0) {
      transform.zoomIn(point);
      return;
    }
    transform.zoomOut(point);
  };

  onMount(() => {
    app().stage.on("wheel", onWheel);
  });

  onCleanup(() => {
    app().stage.off("wheel", onWheel);
  });
};

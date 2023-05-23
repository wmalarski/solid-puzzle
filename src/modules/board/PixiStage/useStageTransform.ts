import type * as PIXI from "pixi.js";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { useTransformContext } from "../TransformContext";
import { usePixiApp } from "./PixiApp";

const useZoom = () => {
  const app = usePixiApp();
  const transform = useTransformContext();

  createEffect(() => {
    app().stage.transform.scale.set(transform.scale());
    app().stage.transform.position.set(transform.x(), transform.y());
  });
};

const usePane = () => {
  const app = usePixiApp();
  const transform = useTransformContext();

  const [startX, setStartX] = createSignal<number>(0);
  const [startY, setStartY] = createSignal<number>(0);

  const [originX, setOriginX] = createSignal<number>();
  const [originY, setOriginY] = createSignal<number>();

  const onPointerDown = (event: PIXI.FederatedPointerEvent) => {
    setStartX(transform.x());
    setStartY(transform.y());
    setOriginX(event.x);
    setOriginY(event.y);
  };

  onMount(() => {
    app().stage.on("pointerdown", onPointerDown);
  });

  onCleanup(() => {
    app().stage.off("pointerdown", onPointerDown);
  });

  createEffect(() => {
    const originXPosition = originX();
    const originYPosition = originY();
    if (!originXPosition || !originYPosition) {
      return;
    }

    const onPointerMove = (event: PIXI.FederatedPointerEvent) => {
      transform.setX(startX() - originXPosition + event.x);
      transform.setY(startY() - originYPosition + event.y);
    };

    const onDragEnd = () => {
      app().stage.off("pointermove", onPointerMove);
      setOriginX();
      setOriginY();
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

const useWheel = () => {
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

export const useStageTransform = () => {
  useZoom();
  usePane();
  useWheel();
};

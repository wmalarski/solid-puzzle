import type { FederatedPointerEvent, FederatedWheelEvent } from "pixi.js";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { useTransformContext } from "../TransformContext";
import { usePixiContainer } from "./PixiApp";

const useZoom = () => {
  const container = usePixiContainer();
  const transform = useTransformContext();

  createEffect(() => {
    container.scale.set(transform.scale(), transform.scale());
    container.position.set(transform.x(), transform.y());
  });
};

const usePane = () => {
  const container = usePixiContainer();
  const transform = useTransformContext();

  const [startX, setStartX] = createSignal<number>(0);
  const [startY, setStartY] = createSignal<number>(0);

  const [originX, setOriginX] = createSignal<number>();
  const [originY, setOriginY] = createSignal<number>();

  const onPointerDown = (event: FederatedPointerEvent) => {
    console.log("onPointerDown", event);
    setStartX(transform.x());
    setStartY(transform.y());
    setOriginX(event.x);
    setOriginY(event.y);
  };

  onMount(() => {
    container.on("pointerdown", onPointerDown);
  });

  onCleanup(() => {
    container.off("pointerdown", onPointerDown);
  });

  createEffect(() => {
    const originXPosition = originX();
    const originYPosition = originY();
    if (!originXPosition || !originYPosition) {
      return;
    }

    const onPointerMove = (event: FederatedPointerEvent) => {
      transform.setX(startX() - originXPosition + event.x);
      transform.setY(startY() - originYPosition + event.y);
    };

    const onDragEnd = () => {
      container.off("pointermove", onPointerMove);
      setOriginX();
      setOriginY();
    };

    onMount(() => {
      container.on("pointermove", onPointerMove);
      container.on("pointerup", onDragEnd);
      container.on("pointerupoutside", onDragEnd);
    });

    onCleanup(() => {
      container.off("pointermove", onPointerMove);
      container.off("pointerup", onDragEnd);
      container.off("pointerupoutside", onDragEnd);
    });
  });
};

const useWheel = () => {
  const container = usePixiContainer();
  const transform = useTransformContext();

  const onWheel = (event: FederatedWheelEvent) => {
    const point = { x: event.globalX, y: event.globalY };

    if (event.deltaY < 0) {
      transform.zoomIn(point);
      return;
    }
    transform.zoomOut(point);
  };

  onMount(() => {
    container.on("wheel", onWheel);
  });

  onCleanup(() => {
    container.off("wheel", onWheel);
  });
};

export const useStageTransform = () => {
  useZoom();
  usePane();
  useWheel();
};

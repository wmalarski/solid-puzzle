import type * as PIXI from "pixi.js";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import type { Point2D } from "~/utils/geometry";

type Props = {
  app: PIXI.Application;
};

export const usePane = (props: Props) => {
  const { setZoomParams, zoomParams } = useZoomParams();
  const [origin, setOrigin] = createSignal<Point2D>();
  const [start, setStart] = createSignal<Point2D>({ x: 0, y: 0 });

  const onPointerDown = (event: PIXI.FederatedPointerEvent) => {
    if (event.button !== 2) {
      return;
    }

    const zoom = zoomParams();
    setOrigin({ x: event.x, y: event.y });
    setStart({ x: zoom.x, y: zoom.y });
  };

  onMount(() => {
    props.app.stage.on("pointerdown", onPointerDown);
  });

  onCleanup(() => {
    props.app.stage.off("pointerdown", onPointerDown);
  });

  createEffect(() => {
    const originPosition = origin();
    if (!originPosition) {
      return;
    }

    const onPointerMove = (event: PIXI.FederatedPointerEvent) => {
      const startPosition = start();
      setZoomParams({
        scale: zoomParams().scale,
        x: startPosition.x - originPosition.x + event.x,
        y: startPosition.y - originPosition.y + event.y,
      });
    };

    const onDragEnd = () => {
      props.app.stage.off("pointermove", onPointerMove);
      setOrigin();
    };

    onMount(() => {
      props.app.stage.on("pointermove", onPointerMove);
      props.app.stage.on("pointerup", onDragEnd);
      props.app.stage.on("pointerupoutside", onDragEnd);
    });

    onCleanup(() => {
      props.app.stage.off("pointermove", onPointerMove);
      props.app.stage.off("pointerup", onDragEnd);
      props.app.stage.off("pointerupoutside", onDragEnd);
    });
  });
};

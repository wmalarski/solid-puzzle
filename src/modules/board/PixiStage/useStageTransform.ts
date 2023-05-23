import type * as PIXI from "pixi.js";
import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import type { Point2D } from "~/utils/geometry";

export const useStageTransform = () => {
  const [scale, setScale] = createSignal(1);
  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);

  const reset = () => {
    setScale(1);
    setX(0);
    setY(0);
  };

  return { reset, scale, setScale, setX, setY, x, y };
};

export type StageTransform = ReturnType<typeof useStageTransform>;

type UseZoomArgs = {
  app: PIXI.Application;
  transform: StageTransform;
};

export const useZoom = (props: UseZoomArgs) => {
  createEffect(() => {
    props.app.stage.transform.scale.set(props.transform.scale());
    props.app.stage.transform.position.set(
      props.transform.x(),
      props.transform.y()
    );
  });
};

type UsePaneArgs = {
  app: PIXI.Application;
  transform: StageTransform;
};

export const usePane = (props: UsePaneArgs) => {
  const [origin, setOrigin] = createSignal<Point2D>();
  const [start, setStart] = createSignal<Point2D>({ x: 0, y: 0 });

  const onPointerDown = (event: PIXI.FederatedPointerEvent) => {
    if (event.button !== 2) {
      return;
    }

    setOrigin({ x: event.x, y: event.y });
    setStart({ x: props.transform.x(), y: props.transform.y() });
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
      props.transform.setX(startPosition.x - originPosition.x + event.x);
      props.transform.setY(startPosition.y - originPosition.y + event.y);
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

type TransformState = {
  x: number;
  y: number;
  scale: number;
};

const scaleBy = 1.1;

const getNewZoomState = (
  newScale: number,
  point: Point2D,
  old: TransformState
): TransformState => {
  const { x: stageX, y: stageY, scale: stageScale } = old;
  const mouseX = point.x / stageScale - stageX / stageScale;
  const mouseY = point.y / stageScale - stageY / stageScale;
  const newStageX = -(mouseX - point.x / newScale) * newScale;
  const newStageY = -(mouseY - point.y / newScale) * newScale;
  return { ...old, scale: newScale, x: newStageX, y: newStageY };
};

type Props = {
  app: PIXI.Application;
  transform: StageTransform;
};

export const useWheel = (props: Props) => {
  const transformState = createMemo(() => {
    return {
      scale: props.transform.scale(),
      x: props.transform.x(),
      y: props.transform.y(),
    };
  });

  const setTransformState = (state: TransformState) => {
    props.transform.setScale(state.scale);
    props.transform.setX(props.transform.x());
    props.transform.setY(props.transform.y());
  };

  const zoomIn = (point: Point2D) => {
    const state = transformState();
    setTransformState(getNewZoomState(state.scale * scaleBy, point, state));
  };

  const zoomOut = (point: Point2D) => {
    const state = transformState();
    setTransformState(getNewZoomState(state.scale / scaleBy, point, state));
  };

  const setZoom = (point: Point2D, scale: number) => {
    const state = transformState();
    setTransformState(getNewZoomState(scale, point, state));
  };

  const onWheel = (event: PIXI.FederatedWheelEvent) => {
    const point = { x: event.globalX, y: event.globalY };
    if (event.deltaY < 0) {
      zoomIn(point);
      return;
    }
    zoomOut(point);
  };

  onMount(() => {
    props.app.stage.on("wheel", onWheel);
  });

  onCleanup(() => {
    props.app.stage.off("wheel", onWheel);
  });

  return { setZoom, zoomIn, zoomOut };
};

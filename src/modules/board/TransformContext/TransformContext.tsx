import {
  Accessor,
  createContext,
  createMemo,
  createSignal,
  ParentProps,
  useContext
} from "solid-js";

import type { Point2D } from "~/utils/geometry";

type TransformState = {
  scale: number;
  x: number;
  y: number;
};

const scaleBy = 1.1;

const getNewZoomState = (
  newScale: number,
  point: Point2D,
  old: TransformState
): TransformState => {
  const { scale: stageScale, x: stageX, y: stageY } = old;
  const mouseX = point.x / stageScale - stageX / stageScale;
  const mouseY = point.y / stageScale - stageY / stageScale;
  const newStageX = -(mouseX - point.x / newScale) * newScale;
  const newStageY = -(mouseY - point.y / newScale) * newScale;
  return { ...old, scale: newScale, x: newStageX, y: newStageY };
};

const createTransform = () => {
  const [scale, setScale] = createSignal(1);
  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);

  const reset = () => {
    setScale(1);
    setX(0);
    setY(0);
  };

  const transformState = () => {
    return { scale: scale(), x: x(), y: y() };
  };

  const setTransformState = (state: TransformState) => {
    setScale(state.scale);
    setX(state.x);
    setY(state.y);
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

  return { reset, scale, setScale, setX, setY, setZoom, x, y, zoomIn, zoomOut };
};

const TransformContext = createContext<
  Accessor<ReturnType<typeof createTransform>>
>(() => {
  throw new Error("TransformContext not defined");
});

export const useTransformContext = () => {
  return useContext(TransformContext);
};

export function TransformContextProvider(props: ParentProps) {
  const value = createMemo(() => createTransform());

  return (
    <TransformContext.Provider value={value}>
      {props.children}
    </TransformContext.Provider>
  );
}

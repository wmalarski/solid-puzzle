import {
  createContext,
  createSignal,
  useContext,
  type Component,
  type JSX,
} from "solid-js";
import type { Point2D } from "~/utils/geometry";

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

export type TransformContextValue = {
  reset: () => void;
  scale: () => number;
  setScale: (scale: number) => void;
  setX: (x: number) => void;
  setY: (y: number) => void;
  zoomIn: (point: Point2D) => void;
  zoomOut: (point: Point2D) => void;
  setZoom: (point: Point2D, scale: number) => void;
  x: () => number;
  y: () => number;
};

const createTransform = (): TransformContextValue => {
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

const TransformContext = createContext<TransformContextValue>({
  reset: () => void 0,
  scale: () => 1,
  setScale: () => void 0,
  setX: () => void 0,
  setY: () => void 0,
  setZoom: () => void 0,
  x: () => 0,
  y: () => 0,
  zoomIn: () => void 0,
  zoomOut: () => void 0,
});

export const useTransformContext = () => {
  return useContext(TransformContext);
};

type Props = {
  children: JSX.Element;
};

export const TransformContextProvider: Component<Props> = (props) => {
  const value = createTransform();

  return (
    <TransformContext.Provider value={value}>
      {props.children}
    </TransformContext.Provider>
  );
};

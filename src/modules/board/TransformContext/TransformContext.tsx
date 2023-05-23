import {
  createContext,
  createSignal,
  useContext,
  type Component,
  type JSX,
} from "solid-js";

export type TransformContextValue = {
  reset: () => void;
  scale: () => number;
  setScale: (scale: number) => void;
  setX: (x: number) => void;
  setY: (y: number) => void;
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

  return { reset, scale, setScale, setX, setY, x, y };
};

const TransformContext = createContext<TransformContextValue>({
  reset: () => void 0,
  scale: () => 1,
  setScale: () => void 0,
  setX: () => void 0,
  setY: () => void 0,
  x: () => 0,
  y: () => 0,
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

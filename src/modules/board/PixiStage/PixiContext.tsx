import type * as PIXI from "pixi.js";
import {
  createContext,
  createMemo,
  useContext,
  type Component,
  type JSX,
} from "solid-js";

type PixiContextValue = {
  app: PIXI.Application;
};

const PixiContext = createContext<() => PixiContextValue | null>(() => null);

export const usePixiContext = () => {
  const value = useContext(PixiContext)();
  if (!value) {
    throw new Error("PIXI Context is not defined");
  }
  return value;
};

type Props = {
  app: PIXI.Application;
  children: JSX.Element;
};

export const PixiContextProvider: Component<Props> = (props) => {
  const value = createMemo(() => ({
    app: props.app,
  }));

  return (
    <PixiContext.Provider value={value}>{props.children}</PixiContext.Provider>
  );
};

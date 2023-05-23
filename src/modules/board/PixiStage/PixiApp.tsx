import * as PIXI from "pixi.js";
import {
  createContext,
  createMemo,
  useContext,
  type Component,
  type JSX,
} from "solid-js";

const PixiAppContext = createContext<() => PIXI.Application>(
  () => null as unknown as PIXI.Application
);

export const usePixiApp = () => {
  return useContext(PixiAppContext);
};

type Props = {
  canvas: HTMLCanvasElement;
  children: JSX.Element;
};

export const PixiAppProvider: Component<Props> = (props) => {
  const value = createMemo(() => {
    const app = new PIXI.Application({ view: props.canvas });
    // app.stage.interactive = true;
    app.stage.hitArea = app.screen;
    return app;
  });

  return (
    <PixiAppContext.Provider value={value}>
      {props.children}
    </PixiAppContext.Provider>
  );
};

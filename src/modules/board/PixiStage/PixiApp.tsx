import * as PIXI from "pixi.js";
import {
  createContext,
  createMemo,
  onCleanup,
  onMount,
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
    const app = new PIXI.Application({
      background: "white",
      height: window.innerHeight,
      view: props.canvas,
      width: window.innerWidth,
    });
    app.stage.eventMode = "dynamic";
    app.stage.hitArea = app.screen;
    app.renderer.resize(window.innerWidth, window.innerHeight);
    return app;
  });

  const onResize = () => {
    value().renderer.resize(window.innerWidth, window.innerHeight);
  };

  onMount(() => {
    window.addEventListener("resize", onResize);
  });

  onCleanup(() => {
    window.removeEventListener("resize", onResize);
  });

  return (
    <PixiAppContext.Provider value={value}>
      {props.children}
    </PixiAppContext.Provider>
  );
};

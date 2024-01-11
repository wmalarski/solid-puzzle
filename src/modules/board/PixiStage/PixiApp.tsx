import { Application } from "pixi.js";
import {
  type Component,
  type JSX,
  createContext,
  createResource,
  onCleanup,
  onMount,
  useContext,
} from "solid-js";

const PixiAppContext = createContext<Application>({} as unknown as Application);

export const usePixiApp = () => {
  return useContext(PixiAppContext);
};

type Props = {
  canvas: HTMLCanvasElement;
  children: JSX.Element;
};

export const PixiAppProvider: Component<Props> = (props) => {
  const app = new Application();

  createResource(async () => {
    await app.init({
      antialias: true,
      canvas: props.canvas,
      eventMode: "static",
      height: window.innerHeight,
      width: window.innerWidth,
    });

    app.stage.hitArea = {
      contains() {
        return true;
      },
    };

    app.renderer.resize(window.innerWidth, window.innerHeight);
  });

  const onResize = () => {
    app.stage.hitArea = app.screen;
    app.renderer.resize(window.innerWidth, window.innerHeight);
  };

  onMount(() => {
    window.addEventListener("resize", onResize);
  });

  onCleanup(() => {
    window.removeEventListener("resize", onResize);
  });

  return (
    <PixiAppContext.Provider value={app}>
      {props.children}
    </PixiAppContext.Provider>
  );
};

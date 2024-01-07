import { Application, Container } from "pixi.js";
import {
  createContext,
  createResource,
  onCleanup,
  onMount,
  useContext,
  type Component,
  type JSX,
} from "solid-js";
import { BoardBackground } from "./PuzzleBoard/BoardBorder";

const PixiAppContext = createContext<Application>({} as unknown as Application);

export const usePixiApp = () => {
  return useContext(PixiAppContext);
};

const PixiContainerContext = createContext<Container>(
  {} as unknown as Container,
);

export const usePixiContainer = () => {
  return useContext(PixiContainerContext);
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

    app.stage.hitArea = app.screen;
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

  const container = new Container();

  onMount(() => {
    container.eventMode = "static";
    app.stage.addChild(container);
  });

  onCleanup(() => {
    app.stage.removeChild(container);
    container.destroy();
  });

  return (
    <PixiAppContext.Provider value={app}>
      <PixiContainerContext.Provider value={container}>
        <BoardBackground />
        {/* <BoardBorder color={0xffff00} container={app.stage} /> */}
        {props.children}
      </PixiContainerContext.Provider>
    </PixiAppContext.Provider>
  );
};

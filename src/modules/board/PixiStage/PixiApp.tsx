import { Application, Container } from "pixi.js";
import {
  type JSX,
  createContext,
  createEffect,
  createMemo,
  createResource,
  onCleanup,
  onMount,
  untrack,
  useContext
} from "solid-js";

import { useThemeContext } from "~/contexts/ThemeContext";

import { useBoardTheme } from "./BoardTheme";

const PixiAppContext = createContext<Application>({} as unknown as Application);

const ContainerContext = createContext<Container>({} as unknown as Container);

export const usePixiApp = () => {
  return useContext(PixiAppContext);
};

export const usePixiContainer = () => {
  return useContext(ContainerContext);
};

type PixiAppProviderProps = {
  canvas: HTMLCanvasElement;
  children: JSX.Element;
};

export function PixiAppProvider(props: PixiAppProviderProps) {
  const theme = useThemeContext();
  const boardTheme = useBoardTheme();

  const backgroundColor = createMemo(() => {
    return theme.theme() === "dracula"
      ? boardTheme.backgroundDarkColor
      : boardTheme.backgroundLightColor;
  });

  const app = new Application();

  const hitArea = {
    contains() {
      return true;
    }
  };

  const container = new Container({ hitArea });

  createResource(async () => {
    await app.init({
      antialias: true,
      backgroundColor: untrack(backgroundColor),
      canvas: props.canvas,
      eventMode: "static",
      height: window.innerHeight,
      width: window.innerWidth
    });

    app.stage.hitArea = hitArea;
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });

  createEffect(() => {
    const color = backgroundColor();
    if (app?.renderer?.background) {
      app.renderer.background.color = color;
    }
  });

  const onResize = () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  };

  onMount(() => {
    window.addEventListener("resize", onResize);
  });

  onCleanup(() => {
    window.removeEventListener("resize", onResize);
  });

  onMount(() => {
    app.stage.addChild(container);
  });

  onCleanup(() => {
    app.stage.removeChild(container);
  });

  return (
    <PixiAppContext.Provider value={app}>
      <ContainerContext.Provider value={container}>
        {props.children}
      </ContainerContext.Provider>
    </PixiAppContext.Provider>
  );
}

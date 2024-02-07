import { Application, Container } from "pixi.js";
import {
  type Component,
  type JSX,
  createContext,
  createResource,
  onCleanup,
  onMount,
  useContext
} from "solid-js";

const PixiAppContext = createContext<Application>({} as unknown as Application);

const ContainerContext = createContext<Container>({} as unknown as Container);

export const usePixiApp = () => {
  return useContext(PixiAppContext);
};

export const usePixiContainer = () => {
  return useContext(ContainerContext);
};

type Props = {
  canvas: HTMLCanvasElement;
  children: JSX.Element;
};

export const PixiAppProvider: Component<Props> = (props) => {
  const app = new Application();

  const container = new Container();

  createResource(async () => {
    await app.init({
      antialias: true,
      canvas: props.canvas,
      eventMode: "static",
      height: window.innerHeight,
      width: window.innerWidth
    });

    const hitArea = {
      contains() {
        return true;
      }
    };

    app.stage.hitArea = hitArea;
    container.hitArea = hitArea;

    app.renderer.resize(window.innerWidth, window.innerHeight);
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
};

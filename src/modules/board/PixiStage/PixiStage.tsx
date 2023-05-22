import * as PIXI from "pixi.js";
import { onCleanup, onMount, type Component } from "solid-js";
import { ImageSprite } from "./ImageSprite";
import { PixiContextProvider } from "./PixiContext";
import { usePane } from "./usePane";
import { usePreventMenu } from "./usePreventMenu";
import { useWheel } from "./useWheel";
import { useZoom } from "./useZoom";

type Props = {
  container: HTMLDivElement;
};

const PixiStage: Component<Props> = (props) => {
  const app = new PIXI.Application({ width: 1000 });
  app.stage.interactive = true;
  app.stage.hitArea = app.screen;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const view = app.view as any as Node;

  onMount(() => {
    props.container.appendChild(view);
  });

  onCleanup(() => {
    props.container.removeChild(view);
  });

  useZoom({ app });
  usePane({ app });
  useWheel({ app });
  usePreventMenu();

  return (
    <PixiContextProvider app={app}>
      <ImageSprite path="https://res.cloudinary.com/demo/image/upload/brown_sheep.jpg" />
    </PixiContextProvider>
  );
};

export default PixiStage;

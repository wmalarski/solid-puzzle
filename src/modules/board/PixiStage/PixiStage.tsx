import * as PIXI from "pixi.js";
import { createMemo, type Component } from "solid-js";
import { ImageSprite } from "./ImageSprite";
import { PixiContextProvider } from "./PixiContext";
import { usePreventMenu } from "./usePreventMenu";
import {
  usePane,
  useStageTransform,
  useWheel,
  useZoom,
} from "./useStageTransform";

type Props = {
  // container: HTMLDivElement;
  canvas: HTMLCanvasElement;
};

const PixiStage: Component<Props> = (props) => {
  const app = createMemo(() => {
    const app = new PIXI.Application({ view: props.canvas });
    // app.stage.interactive = true;
    app.stage.hitArea = app.screen;
    return app;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const view = app.view as any as Node;

  // onMount(() => {
  //   props.container.appendChild(view);
  // });

  // onCleanup(() => {
  //   props.container.removeChild(view);
  // });

  const transform = useStageTransform();
  useZoom({ app: app(), transform });
  usePane({ app: app(), transform });
  useWheel({ app: app(), transform });

  usePreventMenu();

  return (
    <PixiContextProvider app={app()}>
      <ImageSprite path="https://res.cloudinary.com/demo/image/upload/brown_sheep.jpg" />
    </PixiContextProvider>
  );
};

export default PixiStage;

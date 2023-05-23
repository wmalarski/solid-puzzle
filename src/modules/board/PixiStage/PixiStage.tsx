import { type Component } from "solid-js";
import { ImageSprite } from "./ImageSprite";
import { PixiAppProvider } from "./PixiApp";
import { usePreventMenu } from "./usePreventMenu";
import { usePane, useWheel, useZoom } from "./useStageTransform";

const Stage: Component = () => {
  useZoom();
  usePane();
  useWheel();
  usePreventMenu();

  return (
    <ImageSprite path="https://res.cloudinary.com/demo/image/upload/brown_sheep.jpg" />
  );
};

type Props = {
  canvas: HTMLCanvasElement;
};

const PixiStage: Component<Props> = (props) => {
  return (
    <PixiAppProvider canvas={props.canvas}>
      <Stage />
    </PixiAppProvider>
  );
};

export default PixiStage;

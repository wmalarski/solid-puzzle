import { type Component } from "solid-js";
import { TransformContextProvider } from "../TransformContext";
import { ZoomBar } from "../ZoomBar";
import { PixiAppProvider } from "./PixiApp";
import { PuzzleBoard } from "./PuzzleBoard/PuzzleBoard";
import { usePreventMenu } from "./usePreventMenu";
import { useStageTransform } from "./useStageTransform";

const Stage: Component = () => {
  // const app = usePixiApp();

  useStageTransform();
  usePreventMenu();

  // const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
  // sprite.tint = "#aa44ff";
  // sprite.height = 100;
  // sprite.width = 100;

  // onMount(() => {
  //   app().stage.addChild(sprite);
  // });
  // onCleanup(() => {
  //   app().stage.removeChild(sprite);
  // });

  return (
    <PuzzleBoard path="https://res.cloudinary.com/demo/image/upload/brown_sheep.jpg" />
  );
};

type Props = {
  canvas: HTMLCanvasElement;
};

const PixiStage: Component<Props> = (props) => {
  return (
    <PixiAppProvider canvas={props.canvas}>
      <TransformContextProvider>
        <Stage />
        <ZoomBar />
      </TransformContextProvider>
    </PixiAppProvider>
  );
};

export default PixiStage;

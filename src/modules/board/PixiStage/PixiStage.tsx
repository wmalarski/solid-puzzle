import { type Component } from "solid-js";
import type { BoardDetails, RoomDetails } from "~/services/types";
import { TopNavbar } from "../TopNavbar/TopNavbar";
import { TransformContextProvider } from "../TransformContext";
import { ZoomBar } from "../ZoomBar";
import { PixiAppProvider } from "./PixiApp";
import { PuzzleBoard } from "./PuzzleBoard/PuzzleBoard";
import { usePreventMenu } from "./usePreventMenu";
import { useStageTransform } from "./useStageTransform";

const Stage: Component = () => {
  useStageTransform();
  usePreventMenu();

  return (
    <PuzzleBoard path="https://res.cloudinary.com/demo/image/upload/brown_sheep.jpg" />
  );
};

type Props = {
  canvas: HTMLCanvasElement;
  board: BoardDetails;
  room: RoomDetails;
};

const PixiStage: Component<Props> = (props) => {
  return (
    <PixiAppProvider canvas={props.canvas}>
      <TransformContextProvider>
        <Stage />
        <TopNavbar board={props.board} room={props.room} />
        <ZoomBar />
      </TransformContextProvider>
    </PixiAppProvider>
  );
};

export default PixiStage;

import type { Component } from "solid-js";

import type { BoardModel } from "~/types/models";

import { TransformContextProvider } from "../TransformContext";
import { ZoomBar } from "../ZoomBar";
import { BoardThemeProvider } from "./BoardTheme";
import { PixiAppProvider } from "./PixiApp";
import { PuzzleBoard } from "./PuzzleBoard/PuzzleBoard";
import { usePreventMenu } from "./usePreventMenu";
import { useStageTransform } from "./useStageTransform";

type StageProps = {
  board: BoardModel;
};

const Stage: Component<StageProps> = (props) => {
  useStageTransform();
  usePreventMenu();

  return <PuzzleBoard board={props.board} path={props.board.media} />;
};

type Props = {
  board: BoardModel;
  canvas: HTMLCanvasElement;
};

export const PixiStage: Component<Props> = (props) => {
  return (
    <BoardThemeProvider>
      <PixiAppProvider canvas={props.canvas}>
        <TransformContextProvider>
          <Stage board={props.board} />
          <ZoomBar />
        </TransformContextProvider>
      </PixiAppProvider>
    </BoardThemeProvider>
  );
};

import type { Component } from "solid-js";

import type { BoardModel } from "~/types/models";

import { TransformContextProvider } from "../TransformContext";
import { ZoomBar } from "../ZoomBar";
import { BoardThemeProvider } from "./BoardTheme";
import { PixiAppProvider } from "./PixiApp";
import { PuzzleBoard } from "./PuzzleBoard/PuzzleBoard";

type Props = {
  board: BoardModel;
  canvas: HTMLCanvasElement;
};

export const PixiStage: Component<Props> = (props) => {
  return (
    <BoardThemeProvider>
      <PixiAppProvider canvas={props.canvas}>
        <TransformContextProvider>
          <PuzzleBoard board={props.board} path={props.board.media} />
          <ZoomBar />
        </TransformContextProvider>
      </PixiAppProvider>
    </BoardThemeProvider>
  );
};

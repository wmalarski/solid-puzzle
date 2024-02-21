import {
  type Component,
  ErrorBoundary,
  Show,
  Suspense,
  createSignal
} from "solid-js";

import type { BoardAccess } from "~/server/access/rpc";
import type { BoardModel, FragmentModel } from "~/types/models";

import { InfoBar } from "~/modules/board/InfoBar";
import { ErrorFallback } from "~/modules/common/ErrorFallback";

import { BoardPlaceholder } from "../BoardPlaceholder";
import { BoardRevalidateProvider } from "../DataProviders/BoardRevalidate";
import { PlayerCursorProvider } from "../DataProviders/CursorProvider";
import { PlayerPresenceProvider } from "../DataProviders/PresenceProvider";
import { PuzzleStateProvider } from "../DataProviders/PuzzleProvider";
import { PlayerSelectionProvider } from "../DataProviders/SelectionProvider";
import { MenuBar } from "../MenuBar";
import { PixiStage } from "../PixiStage";
import { ReloadDialog } from "../ReloadDialog";
import { TopBar } from "../TopBar";

type ClientBoardProps = {
  board: BoardModel;
};

const ClientBoard: Component<ClientBoardProps> = (props) => {
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();

  return (
    <>
      <canvas class="size-full bg-base-100" ref={setCanvas} />
      <Show when={canvas()}>
        {(canvas) => (
          <Suspense fallback={<BoardPlaceholder />}>
            <PixiStage board={props.board} canvas={canvas()} />
          </Suspense>
        )}
      </Show>
    </>
  );
};

type BoardProps = {
  board: BoardModel;
  boardAccess: BoardAccess;
  fragments: FragmentModel[];
};

export const Board: Component<BoardProps> = (props) => {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Suspense fallback={<BoardPlaceholder />}>
        <BoardRevalidateProvider boardId={props.boardAccess.boardId} />
        <PlayerSelectionProvider boardAccess={props.boardAccess}>
          <PlayerCursorProvider boardAccess={props.boardAccess}>
            <PlayerPresenceProvider boardAccess={props.boardAccess}>
              <PuzzleStateProvider
                board={props.board}
                boardAccess={props.boardAccess}
                fragments={props.fragments}
              >
                <ClientBoard board={props.board} />
                <TopBar board={props.board} boardAccess={props.boardAccess} />
                <InfoBar />
                <MenuBar board={props.board} />
                <ReloadDialog boardId={props.board.id} />
              </PuzzleStateProvider>
            </PlayerPresenceProvider>
          </PlayerCursorProvider>
        </PlayerSelectionProvider>
      </Suspense>
    </ErrorBoundary>
  );
};

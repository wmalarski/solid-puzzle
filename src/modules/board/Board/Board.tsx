import {
  Component,
  createSignal,
  ErrorBoundary,
  Show,
  Suspense
} from "solid-js";

import type { BoardAccess } from "~/server/access/rpc";
import type { BoardModel, FragmentModel } from "~/types/models";

import { InfoBar } from "~/modules/board/InfoBar/InfoBar";
import { ErrorFallback } from "~/modules/common/ErrorFallback/ErrorFallback";

import { BoardPlaceholder } from "../BoardPlaceholder/BoardPlaceholder";
import { BoardRevalidateProvider } from "../DataProviders/BoardRevalidate";
import { BroadcastProvider } from "../DataProviders/BroadcastProvider";
import { PlayerCursorProvider } from "../DataProviders/CursorProvider";
import { PlayerPresenceProvider } from "../DataProviders/PresenceProvider";
import { PuzzleStateProvider } from "../DataProviders/PuzzleProvider";
import { PlayerSelectionProvider } from "../DataProviders/SelectionProvider";
import { MenuBar } from "../MenuBar/MenuBar";
import { PixiStage } from "../PixiStage";
import { PreviewContextProvider } from "../PreviewContext/PreviewContext";
import { ReloadDialog } from "../ReloadDialog/ReloadDialog";
import { TopBar } from "../TopBar/TopBar";

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

export default function Board(props: BoardProps) {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Suspense fallback={<BoardPlaceholder />}>
        <BroadcastProvider boardId={props.boardAccess.boardId}>
          <PlayerSelectionProvider playerId={props.boardAccess.playerId}>
            <PlayerCursorProvider playerId={props.boardAccess.playerId}>
              <PlayerPresenceProvider boardAccess={props.boardAccess}>
                <BoardRevalidateProvider boardId={props.boardAccess.boardId}>
                  <PuzzleStateProvider
                    board={props.board}
                    boardAccess={props.boardAccess}
                    fragments={props.fragments}
                  >
                    <PreviewContextProvider>
                      <main class="relative h-screen w-screen">
                        <ClientBoard board={props.board} />
                        <TopBar
                          board={props.board}
                          boardAccess={props.boardAccess}
                        />
                        <InfoBar />
                        <MenuBar board={props.board} />
                        <ReloadDialog boardId={props.board.id} />
                      </main>
                    </PreviewContextProvider>
                  </PuzzleStateProvider>
                </BoardRevalidateProvider>
              </PlayerPresenceProvider>
            </PlayerCursorProvider>
          </PlayerSelectionProvider>
        </BroadcastProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

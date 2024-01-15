import { clientOnly } from "@solidjs/start";
import {
  type Component,
  ErrorBoundary,
  Show,
  Suspense,
  createSignal,
  lazy,
  onMount,
} from "solid-js";

import type { BoardModel } from "~/types/models";
import type { BoardAccess } from "~/server/share/db";

import { useI18n } from "~/contexts/I18nContext";
import { SupabaseProvider } from "~/contexts/SupabaseContext";
import { InfoBar } from "~/modules/common/InfoBar";

import { PlayerCursorProvider } from "../DataProviders/CursorProvider";
import { PlayerPresenceProvider } from "../DataProviders/PresenceProvider";
import { PuzzleStateProvider } from "../DataProviders/PuzzleProvider";
import { PlayerSelectionProvider } from "../DataProviders/SelectionProvider";

const MenuBar = lazy(() => import("../MenuBar"));
const TopNavbar = lazy(() => import("../TopBar"));
const PixiStage = clientOnly(() => import("../PixiStage"));

type ClientBoardProps = {
  board: BoardModel;
};

const ClientBoard: Component<ClientBoardProps> = (props) => {
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();

  return (
    <>
      <canvas class="h-full w-full bg-base-100" ref={setCanvas} />
      <Show when={canvas()}>
        {(canvas) => (
          <Suspense>
            <PixiStage board={props.board} canvas={canvas()} />
          </Suspense>
        )}
      </Show>
    </>
  );
};

const ErrorFallback = (err: unknown, reset: VoidFunction) => {
  const { t } = useI18n();

  onMount(() => {
    // eslint-disable-next-line no-console
    console.error("ERR", err);
  });

  return (
    <div>
      <pre>{JSON.stringify(err, null, 2)}</pre>
      <button onClick={reset}>{t("board.error.reload")}</button>
    </div>
  );
};

type BoardProps = {
  board: BoardModel;
  boardAccess: BoardAccess;
};

export const Board: Component<BoardProps> = (props) => {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Suspense>
        <SupabaseProvider>
          <PlayerPresenceProvider boardAccess={props.boardAccess}>
            <PlayerSelectionProvider boardAccess={props.boardAccess}>
              <PlayerCursorProvider boardAccess={props.boardAccess}>
                <PuzzleStateProvider boardAccess={props.boardAccess}>
                  <ClientBoard board={props.board} />
                  <TopNavbar
                    board={props.board}
                    boardAccess={props.boardAccess}
                  />
                  <InfoBar />
                  <MenuBar />
                </PuzzleStateProvider>
              </PlayerCursorProvider>
            </PlayerSelectionProvider>
          </PlayerPresenceProvider>
        </SupabaseProvider>
      </Suspense>
    </ErrorBoundary>
  );
};

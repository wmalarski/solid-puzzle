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

import type { BoardModel } from "~/server/board/types";
import type { BoardAccess } from "~/server/share/db";

import { useI18n } from "~/contexts/I18nContext";
import { SupabaseProvider } from "~/contexts/SupabaseContext";
import { InfoBar } from "~/modules/common/InfoBar";

import { PlayerPresenceProvider } from "../DataProviders/PresenceProvider";
import { PuzzleStateProvider } from "../DataProviders/PuzzleProvider";
import { RealtimeProvider } from "../DataProviders/RealtimeProvider";

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
            <PuzzleStateProvider>
              <ClientBoard board={props.board} />
              <TopNavbar board={props.board} boardAccess={props.boardAccess} />
              <InfoBar />
              <MenuBar />
              <RealtimeProvider boardId={props.board.id} />
            </PuzzleStateProvider>
          </PlayerPresenceProvider>
        </SupabaseProvider>
      </Suspense>
    </ErrorBoundary>
  );
};

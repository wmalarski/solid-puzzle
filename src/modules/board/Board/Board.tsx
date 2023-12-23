import {
  ErrorBoundary,
  Show,
  Suspense,
  createSignal,
  lazy,
  type Component,
} from "solid-js";
import { ClientOnly } from "~/components/ClientOnly";
import { InfoBar } from "~/modules/common/InfoBar";
import type { BoardModel } from "~/server/board/types";
import type { BoardAccess } from "~/server/share/db";
import { PlayerPresenceProvider } from "../DataProviders/PresenceProvider";
import { PuzzleStateProvider } from "../DataProviders/PuzzleProvider";

const MenuBar = lazy(() => import("../MenuBar"));
const TopNavbar = lazy(() => import("../TopBar"));
const PixiStage = lazy(() => import("../PixiStage"));
const RealtimeProvider = lazy(
  () => import("../DataProviders/RealtimeProvider"),
);

type BoardProps = {
  board: BoardModel;
  boardAccess?: BoardAccess;
};

const ClientBoard: Component<BoardProps> = (props) => {
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();

  return (
    <>
      <canvas ref={setCanvas} class="h-full w-full" />
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
  return (
    <div>
      <pre>{JSON.stringify(err, null, 2)}</pre>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

export const Board: Component<BoardProps> = (props) => {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Suspense>
        <PlayerPresenceProvider>
          <PuzzleStateProvider>
            <ClientOnly>
              <ClientBoard board={props.board} />
            </ClientOnly>
            <TopNavbar board={props.board} boardAccess={props.boardAccess} />
            <InfoBar />
            <MenuBar />
          </PuzzleStateProvider>
        </PlayerPresenceProvider>
        <Suspense>
          <RealtimeProvider boardId={props.board.id} />
        </Suspense>
      </Suspense>
    </ErrorBoundary>
  );
};

import { clientOnly } from "@solidjs/start";
import {
  ErrorBoundary,
  Show,
  Suspense,
  createSignal,
  lazy,
  onMount,
  type Component,
} from "solid-js";
import { useI18n } from "~/contexts/I18nContext";
import { InfoBar } from "~/modules/common/InfoBar";
import type { BoardModel } from "~/server/board/types";
import type { BoardAccess } from "~/server/share/db";
import { PuzzleStateProvider } from "../DataProviders/PuzzleProvider";

const MenuBar = lazy(() => import("../MenuBar"));
const TopNavbar = lazy(() => import("../TopBar"));
const PixiStage = clientOnly(() => import("../PixiStage"));

// const RealtimeProvider = lazy(
//   () => import("../DataProviders/RealtimeProvider"),
// );

type BoardProps = {
  board: BoardModel;
  boardAccess?: BoardAccess;
};

const ClientBoard: Component<BoardProps> = (props) => {
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();

  return (
    <>
      <canvas ref={setCanvas} class="h-full w-full bg-base-100" />
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

export const Board: Component<BoardProps> = (props) => {
  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Suspense>
        {/* <PlayerPresenceProvider> */}
        <PuzzleStateProvider>
          <ClientBoard board={props.board} />
          <TopNavbar board={props.board} boardAccess={props.boardAccess} />
          <InfoBar />
          <MenuBar />
        </PuzzleStateProvider>
        {/* </PlayerPresenceProvider> */}
        {/* <Suspense>
          <RealtimeProvider boardId={props.board.id} />
        </Suspense> */}
      </Suspense>
    </ErrorBoundary>
  );
};

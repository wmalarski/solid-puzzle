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

import type { BoardAccess, BoardModel } from "~/types/models";

import { Button } from "~/components/Button";
import { Card, CardBody, cardTitleClass } from "~/components/Card";
import { XCircleIcon } from "~/components/Icons/XCircleIcon";
import { Link } from "~/components/Link";
import { useI18n } from "~/contexts/I18nContext";
import { InfoBar } from "~/modules/common/InfoBar";
import { paths } from "~/utils/paths";

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
    <div class="flex w-full justify-center pt-10">
      <Card class="w-full max-w-md" variant="bordered">
        <CardBody class="items-center">
          <XCircleIcon class="h-10 w-10 text-error" />
          <header class="flex items-center justify-between gap-2 text-error">
            <h2 class={cardTitleClass()}>{t("board.error.title")}</h2>
          </header>
          <span class="text-center">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {t("board.error.description", { message: (err as any)?.message })}
          </span>
          <Button onClick={reset}>{t("board.error.reload")}</Button>
          <Link href={paths.home}>{t("board.error.home")}</Link>
        </CardBody>
      </Card>
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
      </Suspense>
    </ErrorBoundary>
  );
};

import { Show, Suspense, createSignal, lazy, type Component } from "solid-js";
import { ClientOnly } from "~/components/ClientOnly";
import type { BoardModel } from "~/db/types";
import { InfoBar } from "~/modules/common/InfoBar";
import type { BoardAccess } from "~/server/share/db";

const MenuBar = lazy(() => import("../MenuBar"));
const TopNavbar = lazy(() => import("../TopBar"));
const PixiStage = lazy(() => import("../PixiStage"));

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
export const Board: Component<BoardProps> = (props) => {
  return (
    <Suspense>
      <ClientOnly>
        <ClientBoard board={props.board} />
      </ClientOnly>
      <TopNavbar board={props.board} boardAccess={props.boardAccess} />
      <InfoBar />
      <MenuBar />
    </Suspense>
  );
};

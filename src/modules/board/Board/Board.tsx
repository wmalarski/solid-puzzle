import { Show, Suspense, createSignal, lazy, type Component } from "solid-js";
import { ClientOnly } from "~/components/ClientOnly";
import type { BoardDetails, RoomDetails } from "~/services/types";

const PixiStage = lazy(() => import("../PixiStage/PixiStage"));

type BoardProps = {
  board: BoardDetails;
  room: RoomDetails;
};

const ClientBoard: Component<BoardProps> = (props) => {
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();

  return (
    <>
      <canvas ref={setCanvas} class="h-full w-full" />
      <Show when={canvas()}>
        {(canvas) => (
          <Suspense>
            <PixiStage
              canvas={canvas()}
              board={props.board}
              room={props.room}
            />
          </Suspense>
        )}
      </Show>
    </>
  );
};
export const Board: Component<BoardProps> = (props) => {
  return (
    <ClientOnly>
      <ClientBoard board={props.board} room={props.room} />
    </ClientOnly>
  );
};

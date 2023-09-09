import { Show, Suspense, createSignal, lazy, type Component } from "solid-js";
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

  // const replicache = useReplicache();

  // const messages = createSubscription(
  //   replicache(),
  //   async (tx) => {
  //     const list = await tx.scan({ prefix: "message/" }).entries().toArray();
  //     return list;
  //   },
  //   [],
  // );

  // createEffect(() => {
  //   console.log("messages()", messages());
  // });

  return (
    <>
      {/* <pre>{JSON.stringify(messages(), null, 2)}</pre> */}
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
  );
};

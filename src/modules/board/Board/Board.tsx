import {
  Show,
  Suspense,
  createEffect,
  createSignal,
  lazy,
  type Component,
} from "solid-js";
import { ClientOnly } from "~/components/ClientOnly";
import type { BoardModel } from "~/db/types";
import { createSubscription } from "~/lib/solid-replicache";
import { InfoBar } from "~/modules/common/InfoBar";
import type { BoardAccess } from "~/server/share/db";
import { ReplicacheProvider, useReplicache } from "../ReplicacheClient";

const MenuBar = lazy(() => import("../MenuBar"));
const TopNavbar = lazy(() => import("../TopBar"));
const PixiStage = lazy(() => import("../PixiStage"));

type BoardProps = {
  board: BoardModel;
  boardAccess?: BoardAccess;
};

const ClientBoard: Component<BoardProps> = (props) => {
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();

  const replicache = useReplicache();

  const messages = createSubscription(
    replicache(),
    async (tx) => {
      const list = await tx.scan({ prefix: "message/" }).entries().toArray();
      return list;
    },
    []
  );

  createEffect(() => {
    console.log("messages()", messages());
  });

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
      <ClientOnly>
        <ReplicacheProvider>
          <ClientBoard board={props.board} />
        </ReplicacheProvider>
      </ClientOnly>
      <TopNavbar board={props.board} boardAccess={props.boardAccess} />
      <InfoBar />
      <MenuBar />
    </Suspense>
  );
};

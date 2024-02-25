import { type RouteDefinition, createAsync, useParams } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import {
  type Component,
  ErrorBoundary,
  Show,
  Suspense,
  createMemo
} from "solid-js";

import type { GetBoardAccessLoaderReturn } from "~/server/access/client";
import type { BoardAccess } from "~/server/access/rpc";
import type { SelectBoardLoaderReturn } from "~/server/board/client";

import { Skeleton } from "~/components/Skeleton";
import { SessionProvider, useSessionContext } from "~/contexts/SessionContext";
import { AcceptInviteForm } from "~/modules/board/AcceptInviteForm";
import { ErrorFallback } from "~/modules/common/ErrorFallback";
import { Head } from "~/modules/common/Head";
import { getBoardAccessLoader } from "~/server/access/client";
import { getSessionLoader } from "~/server/auth/client";
import { selectBoardLoader } from "~/server/board/client";

const Board = clientOnly(() => import("~/modules/board/Board"));

type BoardQueryProps = {
  boardAccess?: GetBoardAccessLoaderReturn;
  data: SelectBoardLoaderReturn;
};

const BoardPlaceholder: Component = () => {
  return (
    <div class="h-screen w-screen p-6">
      <Skeleton class="size-full" />
    </div>
  );
};

const BoardQuery: Component<BoardQueryProps> = (props) => {
  const session = useSessionContext();

  const access = createMemo<BoardAccess | null>(() => {
    const cookieAccess = props.boardAccess;
    if (cookieAccess) {
      return cookieAccess;
    }

    const user = session()?.user;
    const metadata = user?.user_metadata;
    if (!user || !metadata?.name || !metadata.color) {
      return null;
    }

    return {
      boardId: props.data.board.id,
      playerColor: metadata.color,
      playerId: user.id,
      userName: metadata.name
    };
  });

  return (
    <>
      <main class="size-screen relative">
        <Show
          fallback={<AcceptInviteForm board={props.data.board} />}
          when={access()}
        >
          {(access) => <Board {...props.data} boardAccess={access()} />}
        </Show>
      </main>
    </>
  );
};

export const route = {
  load: async ({ params }) => {
    await Promise.all([
      getSessionLoader(),
      getBoardAccessLoader(params.boardId)
    ]);
  }
} satisfies RouteDefinition;

export default function BoardSection() {
  const params = useParams();

  const session = createAsync(() => getSessionLoader());

  const boardAccess = createAsync(() => getBoardAccessLoader(params.boardId));

  const data = createAsync(() => selectBoardLoader(params.boardId));

  return (
    <>
      <Head />
      <SessionProvider loadingFallback={<BoardPlaceholder />} value={session()}>
        <ErrorBoundary fallback={ErrorFallback}>
          <Suspense fallback={<BoardPlaceholder />}>
            <Show fallback={<BoardPlaceholder />} when={data()}>
              {(data) => (
                <BoardQuery boardAccess={boardAccess()} data={data()} />
              )}
            </Show>
          </Suspense>
        </ErrorBoundary>
      </SessionProvider>
    </>
  );
}

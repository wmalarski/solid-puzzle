import { type RouteDefinition, createAsync, useParams } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { ErrorBoundary, Show, Suspense, createMemo } from "solid-js";

import type { GetBoardAccessLoaderReturn } from "~/server/access/client";
import type { BoardAccess } from "~/server/access/rpc";

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
  boardId: string;
};

function BoardQuery(props: BoardQueryProps) {
  const session = useSessionContext();

  const data = createAsync(() => selectBoardLoader(props.boardId));

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
      boardId: props.boardId,
      playerColor: metadata.color,
      playerId: user.id,
      userName: metadata.name
    };
  });

  return (
    <Show when={data()}>
      <Show
        fallback={<AcceptInviteForm board={data()!.board} />}
        when={access()}
      >
        <Board
          board={data()!.board}
          boardAccess={access()!}
          fragments={data()!.fragments}
        />
      </Show>
    </Show>
  );
}

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

  return (
    <>
      <Head />
      <SessionProvider value={session()}>
        <ErrorBoundary fallback={ErrorFallback}>
          <Suspense>
            <BoardQuery boardAccess={boardAccess()} boardId={params.boardId} />
          </Suspense>
        </ErrorBoundary>
      </SessionProvider>
    </>
  );
}

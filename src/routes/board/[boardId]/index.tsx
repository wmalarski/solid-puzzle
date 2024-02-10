import {
  Navigate,
  type RouteDefinition,
  createAsync,
  useParams
} from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { createQuery } from "@tanstack/solid-query";
import {
  type Component,
  Match,
  Show,
  Suspense,
  Switch,
  createMemo,
  ErrorBoundary
} from "solid-js";

import type { BoardAccess } from "~/types/models";

import { SessionProvider, useSessionContext } from "~/contexts/SessionContext";
import { AcceptInviteForm } from "~/modules/board/AcceptInviteForm";
import { getBoardAccessLoader } from "~/server/access/client";
import { getSessionLoader } from "~/server/auth/client";
import { selectBoardLoader } from "~/server/board/client";
import { randomHexColor } from "~/utils/colors";
import { paths } from "~/utils/paths";

const Board = clientOnly(() => import("~/modules/board/Board"));

type BoardQueryProps = {
  boardId: string;
};

const BoardQuery: Component<BoardQueryProps> = (props) => {
  const session = useSessionContext();

  const access = createMemo<BoardAccess | null>(() => {
    const cookieAccess = props.boardAccess;
    if (cookieAccess) {
      return cookieAccess;
    }

    const user = session()?.user;
    if (!user) {
      return null;
    }

    return {
      boardId: props.boardId,
      playerColor: randomHexColor(),
      playerId: user.id,
      userName: user.email || user.id
    };
  });

  return (
    <Switch>
      <Match when={boardQuery.status === "success"}>
        <Show
          fallback={<AcceptInviteForm board={boardQuery.data!.board} />}
          when={access()}
        >
          {(access) => (
            <Suspense>
              <Board {...boardQuery.data!} boardAccess={access()} />
            </Suspense>
          )}
        </Show>
      </Match>
      <Match when={boardQuery.status === "error"}>
        <Navigate href={paths.notFound} />
      </Match>
      <Match when={boardQuery.status === "pending"}>
        <pre>Loading</pre>
      </Match>
    </Switch>
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

  const board = createAsync(() => selectBoardLoader(params.boardId));

  return (
    <SessionProvider value={() => session() || null}>
      <main class="size-screen relative">
        <ErrorBoundary fallback={<span>Error</span>}>
          <Suspense fallback={<span>Loading</span>}>
            <BoardQuery boardId={params.boardId} />
          </Suspense>
        </ErrorBoundary>
      </main>
    </SessionProvider>
  );
}

import {
  Navigate,
  type RouteDefinition,
  createAsync,
  useParams,
} from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import {
  type Component,
  Match,
  Show,
  Suspense,
  Switch,
  createMemo,
  lazy,
} from "solid-js";

import type { BoardAccess } from "~/services/access";

import { SessionProvider, useSessionContext } from "~/contexts/SessionContext";
import { AcceptInviteForm } from "~/modules/board/AcceptInviteForm";
import { getSessionLoader } from "~/services/auth";
import {
  getBoardAccessLoader,
  selectBoardQueryOptions,
} from "~/services/board";
import { randomHexColor } from "~/utils/colors";
import { paths } from "~/utils/paths";

const Board = lazy(() => import("~/modules/board/Board"));

type BoardQueryProps = {
  boardAccess?: BoardAccess | null;
  boardId: string;
};

const BoardQuery: Component<BoardQueryProps> = (props) => {
  const session = useSessionContext();

  const boardQuery = createQuery(() =>
    selectBoardQueryOptions({
      id: props.boardId,
    })(),
  );

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
      userName: user.email || user.id,
    };
  });

  return (
    <Switch>
      <Match when={boardQuery.data}>
        {(data) => (
          <Show fallback={<AcceptInviteForm board={data()} />} when={access()}>
            {(access) => (
              <Suspense>
                <Board board={data()} boardAccess={access()} />
              </Suspense>
            )}
          </Show>
        )}
      </Match>
      <Match when={boardQuery.error}>
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
      getBoardAccessLoader(params.boardId),
    ]);
  },
} satisfies RouteDefinition;

export default function BoardSection() {
  const params = useParams();

  const session = createAsync(() => getSessionLoader());

  const boardAccess = createAsync(() => getBoardAccessLoader(params.boardId));

  return (
    <SessionProvider value={() => session() || null}>
      <main class="relative h-screen w-screen">
        <BoardQuery boardAccess={boardAccess()} boardId={params.boardId} />
      </main>
    </SessionProvider>
  );
}

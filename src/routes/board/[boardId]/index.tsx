import { createWritableMemo } from "@solid-primitives/memo";
import {
  Navigate,
  type RouteDefinition,
  createAsync,
  useParams,
} from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { type Component, Match, Show, Suspense, Switch, lazy } from "solid-js";

import type { BoardAccess } from "~/services/access";

import { SessionProvider, useSessionContext } from "~/contexts/SessionContext";
import { AcceptInviteForm } from "~/modules/invite/AcceptInviteForm";
import { getSessionLoader } from "~/server/auth/client";
import { selectBoardQueryOptions } from "~/services/board";
import { randomHexColor } from "~/utils/colors";
import { paths } from "~/utils/paths";

const Board = lazy(() => import("~/modules/board/Board"));

type BoardQueryProps = {
  boardId: string;
};

const BoardQuery: Component<BoardQueryProps> = (props) => {
  const session = useSessionContext();

  const boardQuery = createQuery(() =>
    selectBoardQueryOptions({
      id: props.boardId,
    })(),
  );

  const [access, setAccess] = createWritableMemo<BoardAccess | null>(() => {
    const user = session()?.user;
    return user
      ? {
          boardId: props.boardId,
          playerColor: randomHexColor(),
          playerId: user.id,
          userName: user.email || user.id,
        }
      : null;
  });

  return (
    <Suspense>
      <Switch fallback={<span>Fallback</span>}>
        <Match when={boardQuery.data}>
          {(data) => (
            <Show
              fallback={
                <AcceptInviteForm
                  boardId={props.boardId}
                  onSubmit={setAccess}
                />
              }
              when={access()}
            >
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
    </Suspense>
  );
};

export const route = {
  load: async () => {
    await getSessionLoader();
  },
} satisfies RouteDefinition;

export default function BoardSection() {
  const params = useParams();

  const session = createAsync(() => getSessionLoader());

  return (
    <SessionProvider value={() => session() || null}>
      <main class="relative h-screen w-screen">
        <BoardQuery boardId={params.boardId} />
      </main>
    </SessionProvider>
  );
}

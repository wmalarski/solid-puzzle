import { createWritableMemo } from "@solid-primitives/memo";
import { type RouteDefinition, createAsync, useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { type Component, Show, Suspense } from "solid-js";

import type { BoardAccess } from "~/services/access";

import { SessionProvider } from "~/contexts/SessionContext";
import { Board } from "~/modules/board/Board";
import { AcceptInviteForm } from "~/modules/invite/AcceptInviteForm";
import { getSessionLoader } from "~/server/auth/client";
import { selectBoardQueryOptions } from "~/services/board";
import { randomHexColor } from "~/utils/colors";

type BoardQueryProps = {
  boardAccess: BoardAccess;
  boardId: string;
};

const BoardQuery: Component<BoardQueryProps> = (props) => {
  const boardQuery = createQuery(() =>
    selectBoardQueryOptions({
      id: props.boardId,
    })(),
  );

  return (
    <Suspense>
      <Show when={boardQuery.data}>
        {(board) => <Board board={board()} boardAccess={props.boardAccess} />}
      </Show>
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

  const [access, setAccess] = createWritableMemo<BoardAccess | null>(() => {
    const user = session()?.user;
    return user
      ? {
          boardId: params.boardId,
          playerColor: randomHexColor(),
          playerId: user.id,
          userName: user.email || user.id,
        }
      : null;
  });

  return (
    <SessionProvider value={() => session() || null}>
      <main class="relative h-screen w-screen">
        <Show
          fallback={
            <AcceptInviteForm boardId={params.boardId} onSubmit={setAccess} />
          }
          when={access()}
        >
          {(access) => (
            <BoardQuery boardAccess={access()} boardId={params.boardId} />
          )}
        </Show>
      </main>
    </SessionProvider>
  );
}

import { type RouteDefinition, createAsync, useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { type Component, Show, Suspense } from "solid-js";

import type { BoardAccess } from "~/server/share/db";

import { SessionProvider } from "~/contexts/SessionContext";
import { Board } from "~/modules/board/Board";
import {
  selectBoardQueryOptions,
  selectProtectedBoardLoader,
} from "~/server/board/client";

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
  load: async ({ params }) => {
    try {
      await selectProtectedBoardLoader({ id: params.boardId });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("LOAD error", error);
    }
  },
} satisfies RouteDefinition;

export default function BoardSection() {
  const params = useParams();

  const data = createAsync(() =>
    selectProtectedBoardLoader({ id: params.boardId }),
  );

  return (
    <SessionProvider value={() => data()?.session || null}>
      <main class="relative h-screen w-screen">
        <Show when={data()?.access}>
          {(access) => (
            <BoardQuery boardAccess={access()} boardId={params.boardId} />
          )}
        </Show>
      </main>
    </SessionProvider>
  );
}

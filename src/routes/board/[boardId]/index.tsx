import { createAsync, useParams, type RouteDefinition } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { Show, Suspense, type Component } from "solid-js";
import { SessionProvider } from "~/contexts/SessionContext";
import { Board } from "~/modules/board/Board";
import {
  selectBoardQueryOptions,
  selectProtectedBoardLoader,
} from "~/server/board/client";
import type { BoardModel } from "~/server/board/types";
import type { BoardAccess } from "~/server/share/db";

type BoardQueryProps = {
  boardAccess?: BoardAccess;
  initialBoard?: BoardModel;
};

const BoardQuery: Component<BoardQueryProps> = (props) => {
  const params = useParams();

  const boardQuery = createQuery(() =>
    selectBoardQueryOptions({
      id: params.boardId,
      initialBoard: props.initialBoard,
    })(),
  );

  return (
    <Show when={boardQuery.data}>
      {(board) => <Board board={board()} boardAccess={props.boardAccess} />}
    </Show>
  );
};

export const route = {
  load: async ({ params }) => {
    await selectProtectedBoardLoader({ id: params.boardId });
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
        <Suspense>
          <BoardQuery
            boardAccess={data()?.access}
            initialBoard={data()?.board}
          />
        </Suspense>
      </main>
    </SessionProvider>
  );
}

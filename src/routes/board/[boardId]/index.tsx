import { createQuery } from "@tanstack/solid-query";
import { Show, Suspense, type Component } from "solid-js";
import { useParams, useRouteData, type RouteDataArgs } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { SessionProvider } from "~/contexts/SessionContext";
import { Board } from "~/modules/board/Board";
import {
  selectBoardQueryKey,
  selectBoardServerQuery,
} from "~/server/board/actions";
import { selectBoard } from "~/server/board/db";
import type { BoardModel } from "~/server/board/types";
import { getRequestContext } from "~/server/context";
import { hasBoardAccess, type BoardAccess } from "~/server/share/db";
import { paths } from "~/utils/paths";

type BoardQueryProps = {
  boardAccess?: BoardAccess;
  initialBoard?: BoardModel;
};

const BoardQuery: Component<BoardQueryProps> = (props) => {
  const params = useParams();

  const boardQuery = createQuery(() => ({
    initialData: props.initialBoard,
    queryFn: (context) => selectBoardServerQuery(context.queryKey),
    queryKey: selectBoardQueryKey({ id: params.boardId }),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    suspense: true,
  }));

  return (
    <Show when={boardQuery.data}>
      {(board) => <Board board={board()} boardAccess={props.boardAccess} />}
    </Show>
  );
};

export const routeData = (args: RouteDataArgs) => {
  return createServerData$(
    async ([, boardId], event) => {
      const ctx = await getRequestContext(event);

      const board = selectBoard({ ctx, id: boardId });
      const access = await hasBoardAccess({ boardId, event });

      if (!board || (!access && board.ownerId !== ctx.session?.userId)) {
        throw redirect(paths.notFound);
      }

      return { access, board, session: ctx.session, user: ctx.user };
    },
    { key: ["board", args.params.boardId] },
  );
};

export default function BoardSection() {
  const data = useRouteData<typeof routeData>();

  return (
    <SessionProvider value={() => data()}>
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

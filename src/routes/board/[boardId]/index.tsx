import { createQuery } from "@tanstack/solid-query";
import { Show, Suspense, type Component } from "solid-js";
import { useParams, useRouteData, type RouteDataArgs } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { SessionProvider } from "~/contexts/SessionContext";
import type { BoardModel } from "~/db/types";
import { Board } from "~/modules/board/Board";
import {
  selectBoardQueryKey,
  selectBoardServerQuery,
} from "~/server/board/actions";
import { selectBoard } from "~/server/board/db";
import { getRequestContext } from "~/server/context";
import { paths } from "~/utils/paths";

type BoardQueryProps = {
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
    <Show when={boardQuery.data}>{(board) => <Board board={board()} />}</Show>
  );
};

export const routeData = (args: RouteDataArgs) => {
  return createServerData$(
    async ([, boardId], event) => {
      const ctx = await getRequestContext(event);

      const board = selectBoard({ ctx, id: boardId });

      if (!board) {
        throw redirect(paths.notFound, { status: 404 });
      }

      return { board, session: ctx.session, user: ctx.user };
    },
    { key: ["board", args.params.boardId] }
  );
};

export default function BoardSection() {
  const data = useRouteData<typeof routeData>();

  return (
    <SessionProvider value={() => data()}>
      <main class="relative h-screen w-screen">
        <Suspense>
          <BoardQuery initialBoard={data()?.board} />
        </Suspense>
      </main>
    </SessionProvider>
  );
}

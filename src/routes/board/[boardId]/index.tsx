import { createQuery } from "@tanstack/solid-query";
import { Show, Suspense } from "solid-js";
import { useParams, useRouteData, type RouteDataArgs } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { SessionProvider } from "~/contexts/SessionContext";
import { Board } from "~/modules/board/Board";
import {
  selectBoardQueryKey,
  selectBoardServerQuery,
} from "~/server/board/actions";
import { getSession } from "~/server/lucia";

const BoardQuery = () => {
  const params = useParams();

  const boardQuery = createQuery(() => ({
    queryFn: (context) => selectBoardServerQuery(context.queryKey),
    queryKey: selectBoardQueryKey({ id: params.boardId }),
    suspense: true,
  }));

  return (
    <Show when={boardQuery.data}>{(board) => <Board board={board()} />}</Show>
  );
};

export const routeData = (args: RouteDataArgs) => {
  return createServerData$(
    async (source, event) => {
      const { session, user } = await getSession(event);

      const [, boardId, token] = source;

      console.log("createServerData$", { boardId, token });

      return { session, user };
    },
    { key: ["board", args.params.boardId, args.location.query.token] }
  );
};

export default function BoardSection() {
  const session = useRouteData<typeof routeData>();

  return (
    <SessionProvider value={() => session()}>
      <main class="relative h-screen w-screen">
        <Suspense>
          <BoardQuery />
        </Suspense>
      </main>
    </SessionProvider>
  );
}

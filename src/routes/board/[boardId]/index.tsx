import { createQuery } from "@tanstack/solid-query";
import { Show, Suspense } from "solid-js";
import { useParams, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { SessionProvider } from "~/contexts/SessionContext";
import { Board } from "~/modules/board/Board";
import { getBoardKey, getBoardServerQuery } from "~/server/board";
import { getSession } from "~/server/lucia";

const BoardQuery = () => {
  const params = useParams();

  const boardQuery = createQuery(() => ({
    queryFn: (context) => getBoardServerQuery(context.queryKey),
    queryKey: getBoardKey({ id: params.boardId }),
    suspense: true,
  }));

  return (
    <Show when={boardQuery.data}>
      {(board) => (
        <>
          <pre>{JSON.stringify(boardQuery.data, null, 2)}</pre>
          <Board board={board()} />
        </>
      )}
    </Show>
  );
};

export const routeData = () => {
  return createServerData$(async (_source, event) => {
    const { session, user } = await getSession(event);
    return { session, user };
  });
};

export default function BoardSection() {
  const session = useRouteData<typeof routeData>();

  return (
    <SessionProvider value={() => session()}>
      <main class="relative h-screen w-screen">
        <pre>{JSON.stringify(session(), null, 2)}</pre>
        <Suspense>
          <BoardQuery />
        </Suspense>
      </main>
    </SessionProvider>
  );
}

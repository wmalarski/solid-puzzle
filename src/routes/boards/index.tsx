import { createQuery } from "@tanstack/solid-query";
import { Match, Suspense, Switch, type Component } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { SessionProvider } from "~/contexts/SessionContext";
import {
  BoardsList,
  BoardsListError,
  BoardsListLoading,
  BoardsListRoot,
} from "~/modules/boardList/BoardList";
import { getBoardsKey, getBoardsServerQuery } from "~/server/board";
import { getSession } from "~/server/lucia";

const BoardsQuery: Component = () => {
  const boardQuery = createQuery(() => ({
    queryFn: (context) => getBoardsServerQuery(context.queryKey),
    queryKey: getBoardsKey({ limit: 10, offset: 0 }),
    suspense: true,
  }));

  return (
    <BoardsListRoot>
      <Switch>
        <Match when={boardQuery.status === "error"}>
          <BoardsListError />
        </Match>
        <Match when={boardQuery.status === "pending"}>
          <BoardsListLoading />
        </Match>
        <Match when={boardQuery.status === "success"}>
          <BoardsList boards={boardQuery.data ?? []} />;
        </Match>
      </Switch>
    </BoardsListRoot>
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
          <BoardsQuery />
        </Suspense>
      </main>
    </SessionProvider>
  );
}

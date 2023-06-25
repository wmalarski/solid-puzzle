import { createQuery } from "@tanstack/solid-query";
import { ErrorBoundary, Suspense, type Component } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import { SessionProvider } from "~/contexts/SessionContext";
import {
  BoardsList,
  BoardsListError,
  BoardsListLoading,
  BoardsListRoot,
} from "~/modules/boardList/BoardList";
import { PageFooter, PageLayout } from "~/modules/common/Layout";
import { TopNavbar } from "~/modules/common/TopNavbar";
import { getBoardsKey, getBoardsServerQuery } from "~/server/board";
import { getSession } from "~/server/lucia";

const BoardsQuery: Component = () => {
  const boardQuery = createQuery(() => ({
    queryFn: (context) => getBoardsServerQuery(context.queryKey),
    queryKey: getBoardsKey({ limit: 10, offset: 0 }),
    // suspense: true,
  }));

  return <BoardsList boards={boardQuery.data ?? []} />;
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
      <PageLayout>
        <TopNavbar />
        <BoardsListRoot>
          <ErrorBoundary fallback={<BoardsListError />}>
            <Suspense fallback={<BoardsListLoading />}>
              <BoardsQuery />
            </Suspense>
          </ErrorBoundary>
        </BoardsListRoot>
        <PageFooter />
      </PageLayout>
    </SessionProvider>
  );
}

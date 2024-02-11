import { Navigate, type RouteDefinition, createAsync } from "@solidjs/router";
import { ErrorBoundary, Show, Suspense } from "solid-js";

import { SessionProvider } from "~/contexts/SessionContext";
import {
  BoardsList,
  BoardsListError,
  BoardsListLoading
} from "~/modules/boards/BoardList";
import { PageLayout } from "~/modules/common/Layout";
import { TopNavbar } from "~/modules/common/TopNavbar";
import { getSessionLoader } from "~/server/auth/client";
import { selectBoardsLoader } from "~/server/board/client";
import { paths } from "~/utils/paths";

export const route = {
  load: async () => {
    await getSessionLoader();
    await selectBoardsLoader({ offset: 0 });
  }
} satisfies RouteDefinition;

export default function Home() {
  const session = createAsync(() => getSessionLoader());

  const boards = createAsync(() => selectBoardsLoader({ offset: 0 }));

  return (
    <SessionProvider value={() => session() || null}>
      <Show
        fallback={<Navigate href={paths.signIn} />}
        when={session() !== null}
      >
        <ErrorBoundary fallback={(error) => <BoardsListError error={error} />}>
          <Suspense fallback={<BoardsListLoading />}>
            <Show fallback={<BoardsListLoading />} when={boards()}>
              {(boards) => (
                <PageLayout>
                  <TopNavbar />
                  <BoardsList boards={boards()} />
                </PageLayout>
              )}
            </Show>
          </Suspense>
        </ErrorBoundary>
      </Show>
    </SessionProvider>
  );
}

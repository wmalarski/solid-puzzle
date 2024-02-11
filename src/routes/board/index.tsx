import {
  Navigate,
  type RouteDefinition,
  createAsync,
  useParams
} from "@solidjs/router";
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

const PAGE_LIMIT = 2;

export const route = {
  load: async ({ params }) => {
    const page = +params.page || 0;
    await Promise.all([
      getSessionLoader(),
      selectBoardsLoader({ limit: PAGE_LIMIT, offset: PAGE_LIMIT * page })
    ]);
  }
} satisfies RouteDefinition;

export default function Home() {
  const params = useParams();

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
                  <BoardsList
                    boards={boards()}
                    limit={PAGE_LIMIT}
                    page={+params.page || 0}
                  />
                </PageLayout>
              )}
            </Show>
          </Suspense>
        </ErrorBoundary>
      </Show>
    </SessionProvider>
  );
}

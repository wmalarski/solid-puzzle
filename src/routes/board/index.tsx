import type { Component } from "solid-js";

import {
  Navigate,
  type RouteDefinition,
  createAsync,
  useLocation
} from "@solidjs/router";
import { ErrorBoundary, Show, Suspense, createMemo } from "solid-js";
import {
  coerce,
  number,
  object,
  optional,
  parse,
  parseAsync,
  transform
} from "valibot";

import { SessionProvider } from "~/contexts/SessionContext";
import { BoardsList, BoardsListLoading } from "~/modules/boards/BoardList";
import { ErrorFallback } from "~/modules/common/ErrorFallback";
import { PageLayout } from "~/modules/common/Layout";
import { TopNavbar } from "~/modules/common/TopNavbar";
import { getSessionLoader } from "~/server/auth/client";
import { selectBoardsLoader } from "~/server/board/client";
import { paths } from "~/utils/paths";

const PAGE_LIMIT = 10;

const boardsRouteSchema = () => {
  return object({
    page: transform(optional(coerce(number(), Number), 1), (input) => input - 1)
  });
};

export const route = {
  load: async ({ location }) => {
    const { page } = await parseAsync(boardsRouteSchema(), location.query);
    const session = await getSessionLoader();
    const userId = session?.user.id;

    if (userId) {
      await selectBoardsLoader({
        limit: PAGE_LIMIT,
        offset: PAGE_LIMIT * page,
        userId
      });
    }
  }
} satisfies RouteDefinition;

type BoardFetchingProps = {
  userId: string;
};

const BoardFetching: Component<BoardFetchingProps> = (props) => {
  const location = useLocation();

  const page = createMemo(() => {
    return parse(boardsRouteSchema(), location.query).page;
  });

  const boards = createAsync(() =>
    selectBoardsLoader({
      limit: PAGE_LIMIT,
      offset: PAGE_LIMIT * page(),
      userId: props.userId
    })
  );

  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Suspense fallback={<BoardsListLoading />}>
        <Show fallback={<BoardsListLoading />} when={boards()}>
          {(boards) => (
            <BoardsList boards={boards()} limit={PAGE_LIMIT} page={page()} />
          )}
        </Show>
      </Suspense>
    </ErrorBoundary>
  );
};

export default function BoardPage() {
  const session = createAsync(() => getSessionLoader());

  return (
    <Suspense fallback={<BoardsListLoading />}>
      <SessionProvider value={() => session() || null}>
        <Show
          fallback={<Navigate href={paths.signIn} />}
          when={session() !== null}
        >
          <PageLayout>
            <TopNavbar />
            <Show when={session()}>
              {(session) => <BoardFetching userId={session().user.id} />}
            </Show>
          </PageLayout>
        </Show>
      </SessionProvider>
    </Suspense>
  );
}

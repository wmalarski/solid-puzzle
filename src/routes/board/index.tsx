import type { Component } from "solid-js";

import {
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

import { useI18n } from "~/contexts/I18nContext";
import {
  AuthorizedSessionProvider,
  useAuthorizedSessionContext
} from "~/contexts/SessionContext";
import { BoardsList, BoardsListLoading } from "~/modules/boards/BoardList";
import { ErrorFallback } from "~/modules/common/ErrorFallback";
import { Head } from "~/modules/common/Head";
import { PageLayout } from "~/modules/common/Layout";
import { TopNavbar } from "~/modules/common/TopNavbar";
import { getSessionLoader } from "~/server/auth/client";
import { selectBoardsLoader } from "~/server/board/client";

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

const BoardFetching: Component = () => {
  const location = useLocation();

  const session = useAuthorizedSessionContext();

  const page = createMemo(() => {
    return parse(boardsRouteSchema(), location.query).page;
  });

  const boards = createAsync(() =>
    selectBoardsLoader({
      limit: PAGE_LIMIT,
      offset: PAGE_LIMIT * page(),
      userId: session().user.id
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
  const { t } = useI18n();

  const session = createAsync(() => getSessionLoader());

  return (
    <>
      <Head title={t("list.title")} />
      <Suspense fallback={<BoardsListLoading />}>
        <AuthorizedSessionProvider
          loadingFallback={<BoardsListLoading />}
          value={session()}
        >
          <PageLayout>
            <TopNavbar />
            <BoardFetching />
          </PageLayout>
        </AuthorizedSessionProvider>
      </Suspense>
    </>
  );
}

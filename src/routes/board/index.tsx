import {
  createAsync,
  type RouteDefinition,
  useLocation
} from "@solidjs/router";
import { createMemo, ErrorBoundary, Show, Suspense } from "solid-js";
import * as v from "valibot";

import { useI18n } from "~/contexts/I18nContext";
import {
  AuthorizedUserProvider,
  useAuthorizedUserContext
} from "~/contexts/UserContext";
import { BoardsList, BoardsListLoading } from "~/modules/boards/BoardList";
import { ErrorFallback } from "~/modules/common/ErrorFallback";
import { Head } from "~/modules/common/Head";
import { PageLayout } from "~/modules/common/Layout";
import { TopNavbar } from "~/modules/common/TopNavbar";
import { getUserLoader } from "~/server/auth/client";
import { selectBoardsLoader } from "~/server/board/client";

const PAGE_LIMIT = 10;

const boardsRouteSchema = () => {
  return v.object({
    page: v.pipe(
      v.optional(v.string(), "1"),
      v.transform(Number),
      v.transform((input) => input - 1)
    )
  });
};

export const route = {
  load: async ({ location }) => {
    const { page } = await v.parseAsync(boardsRouteSchema(), location.query);
    const session = await getUserLoader();
    const userId = session?.id;

    if (userId) {
      await selectBoardsLoader({
        limit: PAGE_LIMIT,
        offset: PAGE_LIMIT * page,
        userId
      });
    }
  }
} satisfies RouteDefinition;

function BoardFetching() {
  const location = useLocation();

  const user = useAuthorizedUserContext();

  const page = createMemo(() => {
    return v.parse(boardsRouteSchema(), location.query).page;
  });

  const boards = createAsync(() =>
    selectBoardsLoader({
      limit: PAGE_LIMIT,
      offset: PAGE_LIMIT * page(),
      userId: user().id
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
}

export default function BoardPage() {
  const { t } = useI18n();

  const session = createAsync(() => getUserLoader());

  return (
    <>
      <Head title={t("list.title")} />
      <Suspense fallback={<BoardsListLoading />}>
        <AuthorizedUserProvider
          loadingFallback={<BoardsListLoading />}
          value={session()}
        >
          <PageLayout>
            <TopNavbar />
            <BoardFetching />
          </PageLayout>
        </AuthorizedUserProvider>
      </Suspense>
    </>
  );
}

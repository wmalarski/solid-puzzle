import { createAsync, redirect, type RouteDefinition } from "@solidjs/router";
import { Show } from "solid-js";
import { SessionProvider } from "~/contexts/SessionContext";
import { PageLayout } from "~/modules/common/Layout";
import { TopNavbar } from "~/modules/common/TopNavbar";
import BoardsList from "~/modules/home/BoardList/BoardList";
import { getSessionLoader } from "~/server/auth/client";
import {
  SELECT_BOARDS_DEFAULT_LIMIT,
  selectBoardsLoader,
} from "~/server/board/client";
import { getRequestEventOrThrow } from "~/server/utils";
import { paths } from "~/utils/paths";

export const serverLoad = async () => {
  "use server";

  const event = getRequestEventOrThrow();
  const session = event.context.session;

  if (!session) {
    throw redirect(paths.notFound);
  }

  await selectBoardsLoader({ limit: SELECT_BOARDS_DEFAULT_LIMIT, offset: 0 });
};

export const route = {
  load: async () => {
    await serverLoad();
  },
} satisfies RouteDefinition;

export default function Home() {
  const session = createAsync(() => getSessionLoader());

  return (
    <SessionProvider value={() => session() || null}>
      <PageLayout>
        <TopNavbar />
        <Show when={session()}>
          <BoardsList />
        </Show>
      </PageLayout>
    </SessionProvider>
  );
}

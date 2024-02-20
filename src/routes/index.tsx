import { type RouteDefinition, createAsync } from "@solidjs/router";

import { SessionProvider } from "~/contexts/SessionContext";
import { PageLayout } from "~/modules/common/Layout";
import { TopNavbar } from "~/modules/common/TopNavbar";
import { InsertBoard } from "~/modules/createBoard/InsertBoard";
import { getSessionLoader } from "~/server/auth/client";
import { getInsertBoardArgsLoader } from "~/server/board/client";

export const route = {
  load: async () => {
    await Promise.all([getSessionLoader(), getInsertBoardArgsLoader()]);
  }
} satisfies RouteDefinition;

export default function Home() {
  const session = createAsync(() => getSessionLoader());

  const insertArgs = createAsync(() => getInsertBoardArgsLoader());

  return (
    <SessionProvider value={session()}>
      <PageLayout>
        <TopNavbar />
        <InsertBoard initialValues={insertArgs()} />
      </PageLayout>
    </SessionProvider>
  );
}

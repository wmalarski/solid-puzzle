import { type RouteDefinition, createAsync } from "@solidjs/router";

import { SessionProvider } from "~/contexts/SessionContext";
import { PageLayout } from "~/modules/common/Layout";
import { TopNavbar } from "~/modules/common/TopNavbar";
import { InsertBoard } from "~/modules/home/InsertBoard";
import { getSessionLoader } from "~/services/auth";
import { getInsertBoardArgsLoader } from "~/services/board";

export const route = {
  load: async () => {
    await Promise.all([getSessionLoader(), getInsertBoardArgsLoader()]);
  },
} satisfies RouteDefinition;

export default function Home() {
  const session = createAsync(() => getSessionLoader());
  const insertArgs = createAsync(() => getInsertBoardArgsLoader());

  return (
    <SessionProvider value={() => session() || null}>
      <PageLayout>
        <TopNavbar />
        <InsertBoard initialValues={insertArgs()} />
      </PageLayout>
    </SessionProvider>
  );
}

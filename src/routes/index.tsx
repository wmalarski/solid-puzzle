import { createAsync, type RouteDefinition } from "@solidjs/router";

import { UserProvider } from "~/contexts/UserContext";
import { Head } from "~/modules/common/Head";
import { PageLayout } from "~/modules/common/Layout";
import { TopNavbar } from "~/modules/common/TopNavbar";
import { InsertBoard } from "~/modules/createBoard/InsertBoard";
import { getUserLoader } from "~/server/auth/client";
import { getInsertBoardArgsLoader } from "~/server/board/client";

export const route = {
  load: async () => {
    await Promise.all([getUserLoader(), getInsertBoardArgsLoader()]);
  }
} satisfies RouteDefinition;

export default function Home() {
  const user = createAsync(() => getUserLoader());

  const insertArgs = createAsync(() => getInsertBoardArgsLoader());

  return (
    <>
      <Head />
      <UserProvider value={user()}>
        <PageLayout>
          <TopNavbar />
          <InsertBoard initialValues={insertArgs()} />
        </PageLayout>
      </UserProvider>
    </>
  );
}

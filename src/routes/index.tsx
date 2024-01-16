import { type RouteDefinition, createAsync } from "@solidjs/router";

import { SessionProvider } from "~/contexts/SessionContext";
import { PageLayout } from "~/modules/common/Layout";
import { TopNavbar } from "~/modules/common/TopNavbar";
import { InsertBoard } from "~/modules/home/InsertBoard";
import { getSessionLoader } from "~/services/auth";

export const route = {
  load: async () => {
    await getSessionLoader();
  },
} satisfies RouteDefinition;

export default function Home() {
  const session = createAsync(() => getSessionLoader());

  return (
    <SessionProvider value={() => session() || null}>
      <PageLayout>
        <TopNavbar />
        <InsertBoard />
      </PageLayout>
    </SessionProvider>
  );
}

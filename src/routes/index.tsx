import { type RouteDefinition, createAsync } from "@solidjs/router";
import { Show } from "solid-js";

import { SessionProvider } from "~/contexts/SessionContext";
import { PageLayout } from "~/modules/common/Layout";
import { TopNavbar } from "~/modules/common/TopNavbar";
import { InsertBoard } from "~/modules/home/InsertBoard";
import { getSessionLoader } from "~/server/auth/client";

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
        <Show when={session()}>
          <InsertBoard />
        </Show>
      </PageLayout>
    </SessionProvider>
  );
}

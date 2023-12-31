import { createAsync, type RouteDefinition } from "@solidjs/router";
import { Show } from "solid-js";
import { SessionProvider } from "~/contexts/SessionContext";
import { PageLayout } from "~/modules/common/Layout";
import { TopNavbar } from "~/modules/common/TopNavbar";
import BoardsList from "~/modules/home/BoardList/BoardList";
import { serverLoad } from "./server";

export const route = {
  load: async () => {
    await serverLoad();
  },
} satisfies RouteDefinition;

export default function Home() {
  const session = createAsync(() => serverLoad());

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

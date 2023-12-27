import { createAsync, type RouteDefinition } from "@solidjs/router";
import { SessionProvider } from "~/contexts/SessionContext";
import { getServerSession } from "~/server/auth/actions";

export const route = {
  load: async () => {
    await getServerSession();
  },
} satisfies RouteDefinition;

export default function Home() {
  const session = createAsync(() => getServerSession());

  return (
    <SessionProvider value={() => session() || null}>
      {/* <PageLayout> */}
      {/* <TopNavbar /> */}
      {/* <Show when={session()}>
          <InsertBoard />
          <BoardsList />
        </Show> */}
      {/* </PageLayout> */}
      AA
    </SessionProvider>
  );
}

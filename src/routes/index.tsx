import { createAsync } from "@solidjs/router";
import { Show } from "solid-js";
import { SessionProvider } from "~/contexts/SessionContext";
import { PageLayout } from "~/modules/common/Layout";
import { TopNavbar } from "~/modules/common/TopNavbar";
import BoardsList from "~/modules/home/BoardList/BoardList";
import { InsertBoard } from "~/modules/home/InsertBoard";
import { getServerSession } from "~/server/auth/actions";

export const route = {
  load: () => {
    getServerSession();
  },
};

export default function Home() {
  const session = createAsync(() => getServerSession());

  return (
    <SessionProvider value={() => session() || null}>
      <PageLayout>
        <TopNavbar />
        <Show when={session()}>
          <InsertBoard />
          <BoardsList />
        </Show>
      </PageLayout>
    </SessionProvider>
  );
}

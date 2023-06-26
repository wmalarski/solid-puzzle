import { Show } from "solid-js";
import { useRouteData } from "solid-start";
import { SessionProvider } from "~/contexts/SessionContext";
import { PageLayout } from "~/modules/common/Layout";
import { TopNavbar } from "~/modules/common/TopNavbar";
import BoardsList from "~/modules/home/BoardList/BoardList";
import { InsertBoard } from "~/modules/home/InsertBoard";
import { createSessionServerData } from "~/server/auth";

export const routeData = () => {
  return createSessionServerData();
};

export default function Home() {
  const session = useRouteData<typeof routeData>();

  return (
    <SessionProvider value={() => session()}>
      <PageLayout>
        <TopNavbar />
        <Show when={session()?.session}>
          <InsertBoard />
          <BoardsList />
        </Show>
      </PageLayout>
    </SessionProvider>
  );
}

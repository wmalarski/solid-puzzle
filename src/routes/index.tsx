import { createAsync } from "@solidjs/router";
import { Show } from "solid-js";
import { SessionProvider } from "~/contexts/SessionContext";
import { PageLayout } from "~/modules/common/Layout";
import { TopNavbar } from "~/modules/common/TopNavbar";
import { InsertBoard } from "~/modules/home/InsertBoard";
import { getSessionServerLoader } from "~/server/auth/rpc";

export default function Home() {
  const session = createAsync(() => getSessionServerLoader());

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

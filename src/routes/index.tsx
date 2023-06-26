import { useI18n } from "@solid-primitives/i18n";
import { Show } from "solid-js";
import { useRouteData } from "solid-start";
import { Link } from "~/components/Link";
import { SessionProvider } from "~/contexts/SessionContext";
import { PageLayout } from "~/modules/common/Layout";
import { TopNavbar } from "~/modules/common/TopNavbar";
import BoardsList from "~/modules/home/BoardList/BoardList";
import { createSessionServerData } from "~/server/auth";
import { paths } from "~/utils/paths";

export const routeData = () => {
  return createSessionServerData();
};

export default function Home() {
  const [t] = useI18n();

  const session = useRouteData<typeof routeData>();

  return (
    <SessionProvider value={() => session()}>
      <PageLayout>
        <TopNavbar />
        <Link href={paths.addBoard}>{t("home.addBoard")}</Link>
        <Show when={session()?.session}>
          <BoardsList />
        </Show>
      </PageLayout>
    </SessionProvider>
  );
}

import { useRouteData } from "solid-start";
import { SessionProvider } from "~/contexts/SessionContext";
import { PageFooter, PageLayout } from "~/modules/common/Layout";
import { TopNavbar } from "~/modules/common/TopNavbar";
import { CreateBoard } from "~/modules/createBoard/CreateBoard/CreateBoard";
import { createGuardSessionServerData } from "~/server/auth";

export const routeData = () => {
  return createGuardSessionServerData();
};

export default function AddBoardPage() {
  const session = useRouteData<typeof routeData>();

  return (
    <SessionProvider value={() => session()}>
      <PageLayout>
        <TopNavbar />
        <CreateBoard />
        <PageFooter />
      </PageLayout>
    </SessionProvider>
  );
}

import { useRouteData } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { PageFooter, PageLayout } from "~/modules/common/Layout";
import { TopNavbar } from "~/modules/common/TopNavbar";
import { CreateBoard } from "~/modules/createBoard/CreateBoard/CreateBoard";
import { getLuciaAuth } from "~/server/lucia";
import { paths } from "~/utils/paths";

export const routeData = () => {
  return createServerData$(async (_source, event) => {
    const auth = getLuciaAuth(event);
    const headers = new Headers();
    const authRequest = auth.handleRequest(event.request, headers);

    const { user } = await authRequest.validateUser();

    if (!user) {
      throw redirect(paths.signIn, { headers, status: 302 });
    }

    return user;
  });
};

export default function AddBoardPage() {
  useRouteData<typeof routeData>();

  return (
    <PageLayout>
      <TopNavbar />
      <CreateBoard />
      <PageFooter />
    </PageLayout>
  );
}

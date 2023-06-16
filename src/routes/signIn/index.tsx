import { useRouteData } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { SignIn } from "~/modules/auth/SignIn";
import { FormLayout, PageFooter, PageTitle } from "~/modules/common/Layout";
import { getLuciaAuth } from "~/server/lucia";
import { paths } from "~/utils/paths";

export const routeData = () => {
  return createServerData$(async (_source, event) => {
    const auth = getLuciaAuth(event);
    const headers = new Headers();
    const authRequest = auth.handleRequest(event.request, headers);

    const { session } = await authRequest.validateUser();

    if (session) {
      throw redirect(paths.home, { headers, status: 302 });
    }

    return {};
  });
};

export default function SignInPage() {
  useRouteData<typeof routeData>();

  return (
    <FormLayout>
      <PageTitle />
      <SignIn />
      <PageFooter />
    </FormLayout>
  );
}

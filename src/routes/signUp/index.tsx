import { useRouteData } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { AuthFooter, AuthTitle } from "~/modules/auth/AuthPrimitives";
import { SignUp } from "~/modules/auth/SignUp";
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

export default function SignUpPage() {
  useRouteData<typeof routeData>();

  return (
    <main class="mx-auto flex flex-col items-center p-4">
      <AuthTitle />
      <SignUp />
      <AuthFooter />
    </main>
  );
}

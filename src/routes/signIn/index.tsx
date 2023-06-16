import { useRouteData } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { AuthFooter, AuthTitle } from "~/modules/auth/AuthPrimitives";
import { SignUp } from "~/modules/auth/SignUp";
import { getLuciaAuth } from "~/server/lucia";

export const routeData = () => {
  return createServerData$(async (_source, event) => {
    const auth = getLuciaAuth(event);

    const authRequest = auth.handleRequest(
      event.request,
      event.request.headers
    );

    const session = await authRequest.validateUser();

    if (session) {
      throw redirect("/", 302);
    }

    return {};
  });
};

export default function SignInPage() {
  useRouteData<typeof routeData>();

  return (
    <main class="mx-auto flex flex-col items-center p-4">
      <AuthTitle />
      <SignUp />
      <AuthFooter />
    </main>
  );
}

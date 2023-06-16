import { useRouteData } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { AuthFooter, AuthTitle } from "~/modules/auth/AuthPrimitives";
import { SignUp } from "~/modules/auth/SignUp";
import { getLuciaAuth } from "~/server/lucia";

export const routeData = () => {
  return createServerData$(async (_source, event) => {
    console.log("signUp");

    const auth = getLuciaAuth(event);

    console.log({ auth });

    const authRequest = auth.handleRequest(
      event.request,
      event.request.headers
    );

    console.log({ authRequest });

    const { session } = await authRequest.validateUser();

    console.log({ session });

    if (session) {
      throw redirect("/", 302);
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

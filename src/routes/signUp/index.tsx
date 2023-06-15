import { useRouteData } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { getDrizzle } from "~/db/db";
import { AuthTitle } from "~/modules/auth/AuthPrimitives";
import { SignUp } from "~/modules/auth/SignUp";
import { getLuciaAuth } from "~/server/lucia";

export const routeData = () => {
  return createServerData$(async (_source, event) => {
    const database = getDrizzle();
    const auth = getLuciaAuth(database);
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

export default function SignUpPage() {
  useRouteData<typeof routeData>();

  return (
    <main class="mx-auto flex flex-col items-center p-4">
      <AuthTitle />
      <SignUp />
      <AuthTitle />
    </main>
  );
}

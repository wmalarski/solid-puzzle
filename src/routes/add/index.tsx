import { createServerData$, redirect } from "solid-start/server";
import { SignOutButton } from "~/modules/auth/SignOutButton";
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

    return { user };
  });
};

export default function AddBoardPage() {
  return (
    <main class="relative h-screen w-screen">
      <SignOutButton />
    </main>
  );
}

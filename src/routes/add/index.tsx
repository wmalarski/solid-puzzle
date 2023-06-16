import { createServerData$, redirect } from "solid-start/server";
import { SignOutButton } from "~/modules/auth/SignOutButton";
import { getLuciaAuth } from "~/server/lucia";
import { paths } from "~/utils/paths";

export const routeData = () => {
  return createServerData$(async (_source, event) => {
    console.log("add");
    const auth = getLuciaAuth(event);

    console.log({ auth });

    const authRequest = auth.handleRequest(
      event.request,
      event.request.headers
    );

    console.log({ authRequest });

    const { user } = await authRequest.validateUser();

    console.log({ user });

    if (!user) {
      throw redirect(paths.signIn, 302);
    }

    return {
      user,
    };
  });
};

export default function AddBoardPage() {
  return (
    <main class="relative h-screen w-screen">
      <SignOutButton />
    </main>
  );
}

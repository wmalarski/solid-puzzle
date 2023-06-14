import { useI18n } from "@solid-primitives/i18n";
import { IoTimerSharp } from "solid-icons/io";
import type { Component } from "solid-js";
import { useRouteData } from "solid-start";
import { createServerData$, redirect } from "solid-start/server";
import { getDrizzle } from "~/db/db";
import { SignUp } from "~/modules/auth/SignUp";
import { getLuciaAuth } from "~/server/lucia";
import { paths } from "~/utils/paths";

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

const Footer: Component = () => {
  const [t] = useI18n();

  return (
    <div class="p-4">
      <a class="link text-xs" href={paths.repository}>
        {t("footer.madeBy")}
      </a>
    </div>
  );
};

const Title: Component = () => {
  const [t] = useI18n();

  return (
    <h1 class="max-6-xs my-16 flex items-center text-center text-4xl font-thin uppercase sm:text-6xl">
      <IoTimerSharp />
      {t("home.title")}
    </h1>
  );
};

export default function SignInPage() {
  useRouteData<typeof routeData>();

  return (
    <main class="mx-auto flex flex-col items-center p-4">
      <Title />
      <SignUp />
      <Footer />
    </main>
  );
}

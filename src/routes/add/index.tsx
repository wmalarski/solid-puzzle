import { createServerData$ } from "solid-start/server";
import { getDrizzle } from "~/db/db";
import { getLuciaAuth } from "~/server/lucia";

export const routeData = () => {
  return createServerData$(async (_source, event) => {
    const database = getDrizzle();
    const auth = getLuciaAuth(database);
    const authRequest = auth.handleRequest(
      event.request,
      event.request.headers
    );

    const { user } = await authRequest.validateUser();

    if (!user) throw event.redirect(302, "/login");

    return {
      user,
    };
  });
};

export default function Home() {
  const [t] = useI18n();

  return (
    <main class="relative h-screen w-screen">
      <Link href={paths.signIn}>{t("home.signIn")}</Link>
      <Link href={paths.signUp}>{t("home.signUp")}</Link>
    </main>
  );
}

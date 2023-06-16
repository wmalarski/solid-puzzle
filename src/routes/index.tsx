import { useI18n } from "@solid-primitives/i18n";
import { Link } from "~/components/Link";
import { paths } from "~/utils/paths";

export default function Home() {
  const [t] = useI18n();

  return (
    <main class="relative h-screen w-screen">
      <Link href={paths.signIn}>{t("home.signIn")}</Link>
      <Link href={paths.signUp}>{t("home.signUp")}</Link>
      <Link href={paths.addBoard}>{t("home.addBoard")}</Link>
    </main>
  );
}

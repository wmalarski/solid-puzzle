import { useI18n } from "@solid-primitives/i18n";
import { Link } from "~/components/Link";
import { PageLayout } from "~/modules/common/Layout";
import { TopNavbar } from "~/modules/common/TopNavbar";
import { paths } from "~/utils/paths";

export default function Home() {
  const [t] = useI18n();

  return (
    <PageLayout>
      <TopNavbar />
      <Link href={paths.signIn}>{t("home.signIn")}</Link>
      <Link href={paths.signUp}>{t("home.signUp")}</Link>
      <Link href={paths.addBoard}>{t("home.addBoard")}</Link>
    </PageLayout>
  );
}

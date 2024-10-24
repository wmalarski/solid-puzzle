import { useI18n } from "~/contexts/I18nContext";
import { SignIn } from "~/modules/auth/SignIn/SignIn";
import { Head } from "~/modules/common/Head/Head";

export default function SignInPage() {
  const { t } = useI18n();

  return (
    <>
      <Head title={t("auth.signIn.title")} />
      <SignIn />
    </>
  );
}

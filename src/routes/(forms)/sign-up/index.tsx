import { useI18n } from "~/contexts/I18nContext";
import { SignUp } from "~/modules/auth/SignUp";
import { Head } from "~/modules/common/Head";

export default function SignUpPage() {
  const { t } = useI18n();

  return (
    <>
      <Head title={t("auth.signUp.title")} />
      <SignUp />
    </>
  );
}

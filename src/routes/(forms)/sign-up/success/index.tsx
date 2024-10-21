import { useI18n } from "~/contexts/I18nContext";
import { SignUpSuccess } from "~/modules/auth/SignUpSuccess/SignUpSuccess";
import { Head } from "~/modules/common/Head/Head";

export default function SignUpSuccessPage() {
  const { t } = useI18n();

  return (
    <>
      <Head title={t("auth.signUpSuccess.title")} />
      <SignUpSuccess />
    </>
  );
}

import { useI18n } from "~/contexts/I18nContext";
import { SignUpSuccess } from "~/modules/auth/SignUpSuccess";
import { Head } from "~/modules/common/Head";

export default function SignUpSuccessPage() {
  const { t } = useI18n();

  return (
    <>
      <Head title={t("auth.signUpSuccess.title")} />
      <SignUpSuccess />
    </>
  );
}

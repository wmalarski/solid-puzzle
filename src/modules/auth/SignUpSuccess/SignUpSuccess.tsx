import { type Component } from "solid-js";

import { Card, CardBody, cardTitleClass } from "~/components/Card";
import { CheckCircleIcon } from "~/components/Icons/CheckCircleIcon";
import { Link } from "~/components/Link";
import { useI18n } from "~/contexts/I18nContext";
import { paths } from "~/utils/paths";

export const SignUpSuccess: Component = () => {
  const { t } = useI18n();

  return (
    <Card class="w-full max-w-md" variant="bordered">
      <CardBody class="items-center">
        <CheckCircleIcon class="h-10 w-10 text-success" />
        <header class="flex items-center justify-between gap-2 text-success">
          <h2 class={cardTitleClass()}>{t("auth.signUpSuccess.label")}</h2>
        </header>
        <span class="text-center">{t("auth.signUpSuccess.description")}</span>
        <Link href={paths.signIn}>{t("auth.signIn.title")}</Link>
      </CardBody>
    </Card>
  );
};

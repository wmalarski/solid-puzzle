import { Component } from "solid-js";

import { Card, CardBody, cardTitleClass } from "~/components/Card";
import { CheckCircleIcon } from "~/components/Icons/CheckCircleIcon";
import { Link } from "~/components/Link";
import { useI18n } from "~/contexts/I18nContext";
import { ThemeToggle } from "~/modules/common/ThemeToggle";
import { paths } from "~/utils/paths";

export const SignUpSuccess: Component = () => {
  const { t } = useI18n();

  return (
    <Card bg="base-200" class="w-full max-w-md" variant="bordered">
      <CardBody class="items-center">
        <CheckCircleIcon class="size-10 text-success" />
        <header class="flex items-center justify-between gap-2 text-success">
          <h2 class={cardTitleClass()}>{t("auth.signUpSuccess.label")}</h2>\
          <ThemeToggle />
        </header>
        <span class="text-center">{t("auth.signUpSuccess.description")}</span>
        <Link href={paths.signIn}>{t("auth.signIn.title")}</Link>
      </CardBody>
    </Card>
  );
};

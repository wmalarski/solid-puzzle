import { onMount } from "solid-js";

import { Button } from "~/components/Button";
import { Card, CardBody, cardTitleClass } from "~/components/Card";
import { XCircleIcon } from "~/components/Icons/XCircleIcon";
import { Link } from "~/components/Link";
import { useI18n } from "~/contexts/I18nContext";
import { paths } from "~/utils/paths";

export const ErrorFallback = (err: unknown, reset: VoidFunction) => {
  const { t } = useI18n();

  onMount(() => {
    // eslint-disable-next-line no-console
    console.error("ERROR", err);
  });

  return (
    <div class="flex w-full justify-center pt-10">
      <Card bg="base-200" class="w-full max-w-md" variant="bordered">
        <CardBody class="items-center">
          <XCircleIcon class="size-10 text-error" />
          <header class="flex items-center justify-between gap-2 text-error">
            <h2 class={cardTitleClass()}>{t("error.title")}</h2>
          </header>
          <span class="text-center">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {t("error.description", { message: (err as any)?.message })}
          </span>
          <Button onClick={reset}>{t("error.reload")}</Button>
          <Link href={paths.home}>{t("error.home")}</Link>
        </CardBody>
      </Card>
    </div>
  );
};

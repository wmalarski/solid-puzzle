import type { RouteDefinition } from "@solidjs/router";

import { createAsync } from "@solidjs/router";
import { Suspense } from "solid-js";

import { useI18n } from "~/contexts/I18nContext";
import { AuthorizedSessionProvider } from "~/contexts/SessionContext";
import { Head } from "~/modules/common/Head";
import { IntroForm } from "~/modules/intro/IntroForm";
import { getSessionLoader } from "~/server/auth/client";

export const route = {
  load: async () => {
    await getSessionLoader();
  }
} satisfies RouteDefinition;

export default function IntroductionPage() {
  const { t } = useI18n();

  const session = createAsync(() => getSessionLoader());

  return (
    <>
      <Head title={t("intro.title")} />
      <Suspense>
        <AuthorizedSessionProvider value={session()}>
          <IntroForm />
        </AuthorizedSessionProvider>
      </Suspense>
    </>
  );
}

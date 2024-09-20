import type { RouteDefinition } from "@solidjs/router";

import { createAsync } from "@solidjs/router";
import { Suspense } from "solid-js";

import { useI18n } from "~/contexts/I18nContext";
import { AuthorizedUserProvider } from "~/contexts/UserContext";
import { Head } from "~/modules/common/Head";
import { IntroForm } from "~/modules/intro/IntroForm";
import { getUserLoader } from "~/server/auth/client";

export const route = {
  load: async () => {
    await getUserLoader();
  }
} satisfies RouteDefinition;

export default function IntroductionPage() {
  const { t } = useI18n();

  const user = createAsync(() => getUserLoader());

  return (
    <>
      <Head title={t("intro.title")} />
      <Suspense>
        <AuthorizedUserProvider value={user()}>
          <IntroForm />
        </AuthorizedUserProvider>
      </Suspense>
    </>
  );
}

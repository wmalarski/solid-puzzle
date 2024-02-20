import type { RouteDefinition } from "@solidjs/router";

import { createAsync } from "@solidjs/router";
import { Suspense } from "solid-js";

import { AuthorizedSessionProvider } from "~/contexts/SessionContext";
import { IntroForm } from "~/modules/intro/IntroForm";
import { getSessionLoader } from "~/server/auth/client";

export const route = {
  load: async () => {
    await getSessionLoader();
  }
} satisfies RouteDefinition;

export default function IntroductionPage() {
  const session = createAsync(() => getSessionLoader());

  return (
    <Suspense>
      <AuthorizedSessionProvider
        loadingFallback={<span>Loading</span>}
        unauthorizedFallback={<span>Unauth</span>}
        value={session()}
      >
        <IntroForm />
      </AuthorizedSessionProvider>
    </Suspense>
  );
}

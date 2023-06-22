// @refresh reload
import { I18nContext } from "@solid-primitives/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { Suspense, createSignal, lazy } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Html,
  Routes,
  Scripts,
} from "solid-start";
import { Head } from "./modules/common/Head";
import "./root.css";
import { i18n } from "./utils/i18n";

const ToastProvider = lazy(() =>
  import("~/components/Toast").then((module) => ({
    default: module.ToastProvider,
  }))
);

export default function Root() {
  const [queryClient] = createSignal(new QueryClient());

  return (
    <I18nContext.Provider value={i18n}>
      <Html lang="en" data-theme="acid">
        <Head />
        <Body>
          <Suspense>
            <ErrorBoundary>
              <QueryClientProvider client={queryClient()}>
                <Routes>
                  <FileRoutes />
                </Routes>
                <Suspense>
                  <ToastProvider />
                </Suspense>
              </QueryClientProvider>
            </ErrorBoundary>
          </Suspense>
          <Scripts />
        </Body>
      </Html>
    </I18nContext.Provider>
  );
}

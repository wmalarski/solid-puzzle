// @refresh reload
import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { SolidQueryDevtools } from "@tanstack/solid-query-devtools";
import { Suspense, createSignal, lazy } from "solid-js";

import "./app.css";
import { I18nContextProvider } from "./contexts/I18nContext";
import { SupabaseProvider } from "./contexts/SupabaseContext";
import { Head } from "./modules/common/Head";

const ToastProvider = lazy(() =>
  import("~/components/Toast").then((module) => ({
    default: module.ToastProvider
  }))
);

export default function App() {
  const [queryClient] = createSignal(new QueryClient());
  return (
    <Router
      root={(props) => (
        <SupabaseProvider>
          <I18nContextProvider>
            <QueryClientProvider client={queryClient()}>
              <MetaProvider>
                <Head />
                <Suspense>{props.children}</Suspense>
                <Suspense>
                  <ToastProvider />
                </Suspense>
              </MetaProvider>
              <SolidQueryDevtools buttonPosition="bottom-left" />
            </QueryClientProvider>
          </I18nContextProvider>
        </SupabaseProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

// @refresh reload
import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { Suspense, lazy } from "solid-js";

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
  return (
    <Router
      root={(props) => (
        <SupabaseProvider>
          <I18nContextProvider>
            <MetaProvider>
              <Head />
              <Suspense>{props.children}</Suspense>
              <Suspense>
                <ToastProvider />
              </Suspense>
            </MetaProvider>
          </I18nContextProvider>
        </SupabaseProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

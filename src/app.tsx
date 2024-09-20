// @refresh reload
import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { lazy, Suspense } from "solid-js";

import "./app.css";
import { I18nContextProvider } from "./contexts/I18nContext";
import { ThemeProvider } from "./contexts/ThemeContext";
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
        <ThemeProvider>
          <I18nContextProvider>
            <MetaProvider>
              <Head />
              <Suspense>{props.children}</Suspense>
              <Suspense>
                <ToastProvider />
              </Suspense>
            </MetaProvider>
          </I18nContextProvider>
        </ThemeProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

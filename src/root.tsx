// @refresh reload
import { I18nContext } from "@solid-primitives/i18n";
import { Suspense, lazy } from "solid-js";
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
  return (
    <I18nContext.Provider value={i18n}>
      <Html lang="en" data-theme="acid">
        <Head />
        <Body>
          <Suspense>
            <ErrorBoundary>
              <Routes>
                <FileRoutes />
              </Routes>
              <Suspense>
                <ToastProvider />
              </Suspense>
            </ErrorBoundary>
          </Suspense>
          <Scripts />
        </Body>
      </Html>
    </I18nContext.Provider>
  );
}

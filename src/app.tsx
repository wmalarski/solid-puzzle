// @refresh reload
import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { Suspense, lazy } from "solid-js";
import "./app.css";

const ToastProvider = lazy(() =>
  import("~/components/Toast").then((module) => ({
    default: module.ToastProvider,
  })),
);

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>SolidStart - Basic</Title>
          <a href="/">Index</a>
          <a href="/about">About</a>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

// export default function Root() {
//   const [queryClient] = createSignal(new QueryClient());

//   return (
//     <I18nContext.Provider value={i18n}>
//       <Html lang="en" data-theme="acid">
//         <Head />
//         <Body>
//           <Suspense>
//             <ErrorBoundary>
//               <QueryClientProvider client={queryClient()}>
//                 <Routes>
//                   <FileRoutes />
//                 </Routes>
//                 <Suspense>
//                   <ToastProvider />
//                 </Suspense>
//               </QueryClientProvider>
//             </ErrorBoundary>
//           </Suspense>
//           <Scripts />
//         </Body>
//       </Html>
//     </I18nContext.Provider>
//   );
// }

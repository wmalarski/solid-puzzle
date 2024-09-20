import { createHandler, StartServer } from "@solidjs/start/server";

import { getAppThemeCookie } from "./server/theme/rpc";

export default createHandler(() => {
  const anything = getAppThemeCookie();
  return (
    <StartServer
      document={({ assets, children, scripts }) => (
        <html class="max-w-[100vw]" data-theme={anything} lang="en">
          <head>
            <meta charset="utf-8" />
            <meta
              content="width=device-width, initial-scale=1"
              name="viewport"
            />
            <link href="/icon-32x32.ico" rel="alternate icon" />
            <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
            {assets}
          </head>
          <body class="max-w-[100vw]">
            <div id="app">{children}</div>
            {scripts}
          </body>
        </html>
      )}
    />
  );
});

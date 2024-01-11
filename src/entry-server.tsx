import { createHandler } from "@solidjs/start/entry";
import { StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html class="max-w-[100vw]" lang="en">
        <head>
          <meta charset="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <link href="/favicon.ico" rel="icon" />
          {assets}
        </head>
        <body class="max-w-[100vw]">
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));

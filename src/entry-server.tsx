import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));

// import { luciaMiddleware } from "./server/auth/lucia";
// import { drizzleMiddleware } from "./server/db";
// import { serverEnvMiddleware } from "./server/env";

// export default createHandler(
//   serverEnvMiddleware,
//   drizzleMiddleware,
//   luciaMiddleware,
//   renderAsync((event) => <StartServer event={event} />),
// );

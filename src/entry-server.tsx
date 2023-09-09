import {
  StartServer,
  createHandler,
  renderAsync,
} from "solid-start/entry-server";
import { luciaMiddleware } from "./server/auth/lucia";
import { drizzleMiddleware } from "./server/db";
import { serverEnvMiddleware } from "./server/env";

export default createHandler(
  serverEnvMiddleware,
  drizzleMiddleware,
  luciaMiddleware,
  renderAsync((event) => <StartServer event={event} />),
);

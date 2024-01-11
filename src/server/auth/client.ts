import { cache } from "@solidjs/router";

import { getSessionServerLoader } from "./rpc";

export const SESSION_CACHE_NAME = "session";

export const getSessionLoader = cache(
  getSessionServerLoader,
  SESSION_CACHE_NAME,
);

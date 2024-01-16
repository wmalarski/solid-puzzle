import { action, cache } from "@solidjs/router";

import { getSessionServerLoader, signUpServerAction } from "./rpc";

export const SESSION_CACHE_NAME = "session";

export const getSessionLoader = cache(
  getSessionServerLoader,
  SESSION_CACHE_NAME,
);

export const signUpAction = action(signUpServerAction, "signUpServerAction");

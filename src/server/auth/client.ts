import { action, cache } from "@solidjs/router";

import { SESSION_CACHE_KEY } from "./const";
import {
  getSessionServerLoader,
  signInServerAction,
  signOutServerAction,
  signUpServerAction
} from "./rpc";

export const getSessionLoader = cache(
  getSessionServerLoader,
  SESSION_CACHE_KEY
);

export const signUpAction = action(signUpServerAction);

export const signInAction = action(signInServerAction);

export const signOutAction = action(signOutServerAction);

import { action, cache } from "@solidjs/router";

import { SESSION_CACHE_KEY } from "../server/auth/const";
import {
  getSessionServerLoader,
  signInServerAction,
  signOutServerAction,
  signUpServerAction,
} from "../server/auth/rpc";

export const getSessionLoader = cache(
  getSessionServerLoader,
  SESSION_CACHE_KEY,
);

export const signUpAction = action(signUpServerAction, "signUpAction");

export const signInAction = action(signInServerAction, "signInAction");

export const signOutAction = action(signOutServerAction, "signOutAction");

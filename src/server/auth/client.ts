import { action, cache } from "@solidjs/router";
import {
  getSessionServerLoader,
  signInServerAction,
  signOutServerAction,
  signUpServerAction,
} from "./actions";

const SESSION_CACHE_NAME = "session";

export const signUpAction = action(signUpServerAction, "signUp");

export const signInAction = action(signInServerAction, "signIn");

export const signOutAction = action(signOutServerAction, "signOut");

export const getSessionLoader = cache(
  getSessionServerLoader,
  SESSION_CACHE_NAME,
);

import { action, cache } from "@solidjs/router";

import { USER_CACHE_KEY } from "./const";
import {
  getUserServerLoader,
  signInServerAction,
  signOutServerAction,
  signUpServerAction,
  updateUserServerAction
} from "./rpc";

export const getUserLoader = cache(getUserServerLoader, USER_CACHE_KEY);

export const signUpAction = action(signUpServerAction);

export const signInAction = action(signInServerAction);

export const signOutAction = action(signOutServerAction);

export const updateUserAction = action(updateUserServerAction);

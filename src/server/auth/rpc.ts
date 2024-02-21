"use server";
import type { RequestEvent } from "solid-js/web";

import { redirect } from "@solidjs/router";
import { decode } from "decode-formdata";
import {
  email,
  hexColor,
  maxLength,
  minLength,
  object,
  safeParseAsync,
  string
} from "valibot";

import { paths } from "~/utils/paths";

import {
  getRequestEventOrThrow,
  rpcErrorResult,
  rpcParseIssueResult,
  rpcSuccessResult
} from "../utils";
import { SESSION_CACHE_KEY } from "./const";

const getRedirectUrl = (event: RequestEvent, path: string) => {
  const origin = new URL(event.request.url).origin;
  return origin + path;
};

export const signUpServerAction = async (form: FormData) => {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(
    object({
      email: string([email()]),
      password: string([minLength(6), maxLength(20)])
    }),
    decode(form)
  );

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  const result = await event.locals.supabase.auth.signUp({
    ...parsed.output,
    options: { emailRedirectTo: getRedirectUrl(event, paths.signUpSuccess) }
  });

  if (result.error) {
    return rpcErrorResult(result.error);
  }

  return rpcSuccessResult();
};

export const signInServerAction = async (form: FormData) => {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(
    object({
      email: string([email()]),
      password: string([minLength(3)])
    }),
    decode(form)
  );

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  const result = await event.locals.supabase.auth.signInWithPassword(
    parsed.output
  );

  if (result.error) {
    return rpcErrorResult(result.error);
  }

  throw redirect(paths.home, { revalidate: SESSION_CACHE_KEY });
};

export const signOutServerAction = async () => {
  const event = getRequestEventOrThrow();

  const result = await event.locals.supabase.auth.signOut();

  if (result.error) {
    return rpcErrorResult(result.error);
  }

  throw redirect(paths.signIn, { revalidate: SESSION_CACHE_KEY });
};

export const updateUserServerAction = async (form: FormData) => {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(
    object({
      color: string([hexColor()]),
      name: string()
    }),
    decode(form)
  );

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  const result = await event.locals.supabase.auth.updateUser({
    data: parsed.output
  });

  console.log(JSON.stringify({ parsed, result }, null, 2));

  if (result.error) {
    return rpcErrorResult(result.error);
  }

  return redirect(paths.home, { revalidate: SESSION_CACHE_KEY });
};

export const getSessionServerLoader = async () => {
  const event = getRequestEventOrThrow();
  return await Promise.resolve(event.locals.supabaseSession);
};

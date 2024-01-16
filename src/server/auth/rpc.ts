"use server";
import { redirect } from "@solidjs/router";
import { decode } from "decode-formdata";
import {
  email,
  maxLength,
  minLength,
  object,
  safeParseAsync,
  string,
} from "valibot";

import { paths } from "~/utils/paths";

import {
  getRequestEventOrThrow,
  rpcParseIssueResult,
  rpcSuccessResult,
  rpcSupabaseErrorResult,
} from "../utils";
import { SESSION_CACHE_KEY } from "./cache";

export async function signUpServerAction(form: FormData) {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(
    object({
      email: string([email()]),
      password: string([minLength(6), maxLength(20)]),
    }),
    decode(form),
  );

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  const result = await event.context.supabase.auth.signUp(parsed.output);

  if (result.error) {
    return rpcSupabaseErrorResult(result.error);
  }

  return rpcSuccessResult();
}

export async function signInServerAction(form: FormData) {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(
    object({
      email: string([email()]),
      password: string([minLength(3)]),
    }),
    decode(form),
  );

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  const result = await event.context.supabase.auth.signInWithPassword(
    parsed.output,
  );

  if (result.error) {
    return rpcSupabaseErrorResult(result.error);
  }

  throw redirect(paths.home, { revalidate: SESSION_CACHE_KEY });
}

export async function signOutServerAction() {
  const event = getRequestEventOrThrow();

  const result = await event.context.supabase.auth.signOut();

  if (result.error) {
    return rpcSupabaseErrorResult(result.error);
  }

  throw redirect(paths.signIn, { revalidate: SESSION_CACHE_KEY });
}

export async function getSessionServerLoader() {
  const event = getRequestEventOrThrow();
  console.log("event.context.supabaseSession", event.context.supabaseSession);
  return await Promise.resolve(event.context.supabaseSession);
}

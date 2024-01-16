"use server";
import { decode } from "decode-formdata";
import {
  email,
  maxLength,
  minLength,
  object,
  safeParseAsync,
  string,
} from "valibot";

import {
  getRequestEventOrThrow,
  rpcParseIssueError,
  rpcParseIssueResult,
  rpcSuccessResult,
  rpcSupabaseErrorResult,
} from "../utils";

export async function signUpServerAction(form: FormData) {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(
    object({
      email: string([email()]),
      password: string([minLength(6), maxLength(20)]),
    }),
    decode(form),
  );

  console.log("parsed", parsed);

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  const result = await event.context.supabase.auth.signUp(parsed.output);

  console.log("parsed", result);

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
    throw rpcParseIssueError(parsed.issues);
  }

  const result = await event.context.supabase.auth.signInWithPassword(
    parsed.output,
  );

  if (result.error) {
    throw result.error;
  }

  return { success: true };
}

export async function signOutServerAction() {
  const event = getRequestEventOrThrow();

  const result = await event.context.supabase.auth.signOut();

  if (result.error) {
    throw result.error;
  }

  return { success: true };
}

export async function getSessionServerLoader() {
  const event = getRequestEventOrThrow();
  console.log("event.context.supabaseSession", event.context.supabaseSession);
  return await Promise.resolve(event.context.supabaseSession);
}

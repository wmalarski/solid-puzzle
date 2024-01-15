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

import { getRequestEventOrThrow, rpcParseIssueError } from "../utils";

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
    throw rpcParseIssueError(parsed.issues);
  }

  const result = await event.context.supabase.auth.signUp(parsed.output);

  if (result.error) {
    throw result.error;
  }

  return { success: true };
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
  return await Promise.resolve(event.context.supabaseSession);
}

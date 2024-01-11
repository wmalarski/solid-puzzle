"use server";
import { appendHeader } from "@solidjs/start/server";
import { decode } from "decode-formdata";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { maxLength, minLength, object, safeParseAsync, string } from "valibot";

import { getRequestEventOrThrow, rpcParseIssueError } from "../utils";
import { insertUser, selectUserByUsername } from "./db";
import { getLucia } from "./lucia";

export async function signUpServerAction(form: FormData) {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(
    object({
      password: string([minLength(6), maxLength(20)]),
      username: string([minLength(3), maxLength(20)]),
    }),
    decode(form),
  );

  if (!parsed.success) {
    throw rpcParseIssueError(parsed.issues);
  }

  const lucia = getLucia(event.context);

  const hashedPassword = await new Argon2id().hash(parsed.output.password);
  const userId = generateId(15);

  try {
    insertUser({
      ctx: event.context,
      hashedPassword,
      id: userId,
      username: parsed.output.username,
    });

    const session = await lucia.createSession(userId, {});

    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    throw new Error("An unknown error occurred");
  }

  return { success: true };
}

export async function signInServerAction(form: FormData) {
  const event = getRequestEventOrThrow();

  const parsed = await safeParseAsync(
    object({
      password: string([minLength(3)]),
      username: string([minLength(3)]),
    }),
    decode(form),
  );

  if (!parsed.success) {
    throw rpcParseIssueError(parsed.issues);
  }

  const lucia = getLucia(event.context);

  const existingUser = selectUserByUsername({
    ctx: event.context,
    username: parsed.output.username,
  });

  if (!existingUser || !existingUser.password) {
    throw new Error("Incorrect username or password");
  }

  const isValidPassword = await new Argon2id().verify(
    existingUser.password,
    parsed.output.password,
  );

  if (!isValidPassword) {
    throw new Error("Incorrect username or password");
  }

  const session = await lucia.createSession(existingUser.id, {});

  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize(),
  );

  return { success: true };
}

export async function signOutServerAction() {
  const event = getRequestEventOrThrow();
  const lucia = getLucia(event.context);

  if (!event.context.session) {
    throw new Error("Unauthorized");
  }

  await lucia.invalidateSession(event.context.session.id);
  appendHeader(
    event,
    "Set-Cookie",
    lucia.createBlankSessionCookie().serialize(),
  );

  return true;
}

export async function getSessionServerLoader() {
  const event = getRequestEventOrThrow();
  return await Promise.resolve(event.context.session);
}

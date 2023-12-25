"use server";
import { action, cache, redirect } from "@solidjs/router";
import { appendHeader } from "@solidjs/start/server";
import { decode } from "decode-formdata";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { maxLength, minLength, object, parseAsync, string } from "valibot";
import { paths } from "~/utils/paths";
import { getRequestEventOrThrow } from "../utils";
import { insertUser, selectUserByUsername } from "./db";
import { getLucia } from "./lucia";

const SESSION_CACHE_NAME = "boards";

const signUpArgsSchema = () => {
  return object({
    password: string([minLength(6), maxLength(20)]),
    username: string([minLength(3), maxLength(20)]),
  });
};

export const signUpServerAction = action(async (form: FormData) => {
  const event = getRequestEventOrThrow();
  const parsed = await parseAsync(signUpArgsSchema(), decode(form));
  const lucia = getLucia(event.context);

  const hashedPassword = await new Argon2id().hash(parsed.password);
  const userId = generateId(15);

  try {
    insertUser({
      ctx: event.context,
      hashedPassword,
      username: parsed.username,
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
    return new Error("An unknown error occurred");
  }
  throw redirect(paths.home);
});

const signInArgsSchema = () => {
  return object({
    password: string([minLength(3)]),
    username: string([minLength(3)]),
  });
};

export const signInServerAction = action(async (form: FormData) => {
  const event = getRequestEventOrThrow();
  const parsed = await parseAsync(signInArgsSchema(), decode(form));
  const lucia = getLucia(event.context);

  const existingUser = selectUserByUsername({
    ctx: event.context,
    username: parsed.username,
  });

  if (!existingUser || !existingUser.password) {
    return new Error("Incorrect username or password");
  }

  const isValidPassword = await new Argon2id().verify(
    existingUser.password,
    parsed.password,
  );

  if (!isValidPassword) {
    return new Error("Incorrect username or password");
  }

  const session = await lucia.createSession(existingUser.id, {});

  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize(),
  );

  throw redirect(paths.home);
});

export const signOutServerAction = action(async () => {
  const event = getRequestEventOrThrow();
  const lucia = getLucia(event.context);

  if (!event.context.session) {
    return new Error("Unauthorized");
  }

  await lucia.invalidateSession(event.context.session.id);
  appendHeader(
    event,
    "Set-Cookie",
    lucia.createBlankSessionCookie().serialize(),
  );

  throw redirect(paths.signIn);
});

export const getServerSession = cache(() => {
  const event = getRequestEventOrThrow();
  return event.context.session;
}, SESSION_CACHE_NAME);

export const getServerAnonGuard = () => {
  const session = getServerSession();

  if (session) {
    throw redirect(paths.home);
  }
  return {};
};

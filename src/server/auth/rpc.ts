"use server";
import { appendHeader } from "@solidjs/start/server";
import { decode } from "decode-formdata";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { maxLength, minLength, object, parseAsync, string } from "valibot";
import { getRequestEventOrThrow } from "../utils";
import { insertUser, selectUserByUsername } from "./db";
import { getLucia } from "./lucia";

const signUpArgsSchema = () => {
  return object({
    password: string([minLength(6), maxLength(20)]),
    username: string([minLength(3), maxLength(20)]),
  });
};

export const signUpServerAction = async (form: FormData) => {
  const event = getRequestEventOrThrow();
  const parsed = await parseAsync(signUpArgsSchema(), decode(form));
  const lucia = getLucia(event.context);

  const hashedPassword = await new Argon2id().hash(parsed.password);
  const userId = generateId(15);

  try {
    insertUser({
      ctx: event.context,
      hashedPassword,
      id: userId,
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
    throw new Error("An unknown error occurred");
  }

  return true;
};

const signInArgsSchema = () => {
  return object({
    password: string([minLength(3)]),
    username: string([minLength(3)]),
  });
};

export const signInServerAction = async (form: FormData) => {
  const event = getRequestEventOrThrow();
  const parsed = await parseAsync(signInArgsSchema(), decode(form));
  const lucia = getLucia(event.context);

  const existingUser = selectUserByUsername({
    ctx: event.context,
    username: parsed.username,
  });

  if (!existingUser || !existingUser.password) {
    throw new Error("Incorrect username or password");
  }

  const isValidPassword = await new Argon2id().verify(
    existingUser.password,
    parsed.password,
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

  return session;
};

export const signOutServerAction = async () => {
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
};

export const getSessionServerLoader = async () => {
  const event = getRequestEventOrThrow();
  return await Promise.resolve(event.context.session);
};

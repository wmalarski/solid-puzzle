"use server";
import { action, cache, redirect } from "@solidjs/router";
import { decode } from "decode-formdata";
import { LuciaError } from "lucia";
import { maxLength, minLength, object, parseAsync, string } from "valibot";
import { paths } from "~/utils/paths";
import { getRequestEventOrThrow } from "../utils";
import { getLuciaAuth } from "./lucia";

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
  const auth = getLuciaAuth(event);

  try {
    const user = await auth.createUser({
      attributes: { username: parsed.username },
      key: {
        password: parsed.password,
        providerId: "username",
        providerUserId: parsed.username.toLowerCase(), // hashed by Lucia
      },
    });

    const session = await auth.createSession({
      attributes: {},
      userId: user.userId,
    });

    const sessionCookie = auth.createSessionCookie(session);

    return new Response(null, {
      headers: { Location: "/", "Set-Cookie": sessionCookie.serialize() },
      status: 302,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error({ error });
    throw new ServerError("An unknown error occurred", { status: 500 });
  }
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
  const auth = getLuciaAuth(event);

  try {
    const key = await auth.useKey(
      "username",
      parsed.username.toLowerCase(),
      parsed.password,
    );

    const session = await auth.createSession({
      attributes: {},
      userId: key.userId,
    });

    const sessionCookie = auth.createSessionCookie(session);

    return new Response(null, {
      headers: { Location: "/", "Set-Cookie": sessionCookie.serialize() },
      status: 302,
    });
  } catch (error) {
    if (
      error instanceof LuciaError &&
      (error.message === "AUTH_INVALID_KEY_ID" ||
        error.message === "AUTH_INVALID_PASSWORD")
    ) {
      throw new ServerError("Incorrect username or password");
    }
    throw new ServerError("An unknown error occurred");
  }
});

export const signOutServerAction = action(async () => {
  const event = getRequestEventOrThrow();
  const auth = getLuciaAuth(event);

  const authRequest = auth.handleRequest(event.request);

  const session = await authRequest.validate();

  if (!session) {
    throw new ServerError("Unauthorized", {
      status: 401,
    });
  }

  await auth.invalidateSession(session.sessionId);

  const sessionCookie = auth.createSessionCookie(null);

  return new Response(null, {
    headers: {
      Location: paths.signIn,
      "Set-Cookie": sessionCookie.serialize(),
    },
    status: 302,
  });
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

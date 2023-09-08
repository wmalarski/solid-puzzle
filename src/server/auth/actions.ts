import { LuciaError } from "lucia";
import {
  ServerError,
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { maxLength, minLength, object, string } from "valibot";
import { paths } from "~/utils/paths";
import { formParse } from "../utils";
import { getLuciaAuth, getSession } from "./lucia";

const signUpArgsSchema = () => {
  return object({
    password: string([minLength(6), maxLength(20)]),
    username: string([minLength(3), maxLength(20)]),
  });
};

export const createSignUpServerAction = () => {
  return createServerAction$(async (form: FormData, event) => {
    const parsed = await formParse({ form, schema: signUpArgsSchema() });
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
};

const signInArgsSchema = () => {
  return object({
    password: string([minLength(3)]),
    username: string([minLength(3)]),
  });
};

export const createSignInServerAction = () => {
  return createServerAction$(async (form: FormData, event) => {
    const parsed = await formParse({ form, schema: signInArgsSchema() });
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
};

export const createSignOutServerAction = () => {
  return createServerAction$(async (_form: FormData, event) => {
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
};

export const createGuardSessionServerData = () => {
  return createServerData$(async (_source, event) => {
    const session = await getSession(event);

    if (!session) {
      throw redirect(paths.signIn);
    }

    return session;
  });
};

export const createAnonGuardServerData = () => {
  return createServerData$(async (_source, event) => {
    const session = await getSession(event);

    if (session) {
      throw redirect(paths.home);
    }

    return {};
  });
};

export const createSessionServerData = () => {
  return createServerData$(async (_source, event) => {
    const session = await getSession(event);

    return session;
  });
};

import {
  ServerError,
  createServerAction$,
  createServerData$,
  redirect,
} from "solid-start/server";
import { z } from "zod";
import { paths } from "~/utils/paths";
import { zodFormParse } from "../utils";
import { getLuciaAuth, getSession } from "./lucia";

const signUpArgsSchema = () => {
  return z.object({
    password: z.string().min(6).max(20),
    username: z.string().min(3).max(20),
  });
};

export const createSignUpServerAction = () => {
  return createServerAction$(async (form: FormData, event) => {
    const parsed = await zodFormParse({ form, schema: signUpArgsSchema() });

    const auth = getLuciaAuth(event);
    const headers = new Headers();

    try {
      const user = await auth.createUser({
        attributes: {
          username: parsed.username,
        },
        primaryKey: {
          password: parsed.password,
          providerId: "username",
          providerUserId: parsed.username,
        },
      });

      const session = await auth.createSession(user.userId);
      const authRequest = auth.handleRequest(event.request, headers);

      authRequest.setSession(session);
    } catch (error) {
      // username already used
      // eslint-disable-next-line no-console
      console.error({ error });
      throw new ServerError("username already used");
    }

    throw redirect("/", { headers, status: 302 });
  });
};

const signInArgsSchema = () => {
  return z.object({
    password: z.string().min(3),
    username: z.string().min(3),
  });
};

export const createSignInServerAction = () => {
  return createServerAction$(async (form: FormData, event) => {
    const parsed = await zodFormParse({ form, schema: signInArgsSchema() });

    const auth = getLuciaAuth(event);
    const headers = new Headers();

    try {
      const authRequest = auth.handleRequest(event.request, headers);

      const key = await auth.useKey(
        "username",
        parsed.username,
        parsed.password,
      );

      const session = await auth.createSession(key.userId);

      authRequest.setSession(session);
    } catch (error) {
      // invalid username/password
      // eslint-disable-next-line no-console
      console.error({ error });
      return new ServerError("invalid username/password");
    }

    throw redirect("/", { headers, status: 302 });
  });
};

export const createSignOutServerAction = () => {
  return createServerAction$(async (_form: FormData, event) => {
    const auth = getLuciaAuth(event);

    const headers = new Headers();
    const authRequest = auth.handleRequest(event.request, headers);

    const { session } = await authRequest.validateUser();

    if (!session) {
      throw redirect(paths.signIn, { headers, status: 302 });
    }

    await auth.invalidateSession(session.sessionId);

    authRequest.setSession(null);

    throw redirect(paths.home, { headers, status: 302 });
  });
};

export const createGuardSessionServerData = () => {
  return createServerData$(async (_source, event) => {
    const { headers, session, user } = await getSession(event);

    if (!user || !session) {
      throw redirect(paths.signIn, { headers, status: 302 });
    }

    return { session, user };
  });
};

export const createAnonGuardServerData = () => {
  return createServerData$(async (_source, event) => {
    const { headers, session } = await getSession(event);

    if (session) {
      throw redirect(paths.home, { headers, status: 302 });
    }

    return {};
  });
};

export const createSessionServerData = () => {
  return createServerData$(async (_source, event) => {
    const { session, user } = await getSession(event);

    return { session, user };
  });
};

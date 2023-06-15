import { ServerError, createServerAction$, redirect } from "solid-start/server";
import { z } from "zod";
import { getDrizzle } from "~/db/db";
import { paths } from "~/utils/paths";
import { getLuciaAuth } from "./lucia";
import { zodFormParse } from "./utils";

const signUpArgsSchema = () => {
  return z.object({
    password: z.string().min(6).max(20),
    username: z.string().min(3).max(20),
  });
};

export const createSignUpServerAction = () => {
  return createServerAction$(async (form: FormData, event) => {
    const parsed = await zodFormParse({ form, schema: signUpArgsSchema() });

    const database = getDrizzle();
    const auth = getLuciaAuth(database);

    console.log({ auth, database, parsed });

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

      console.log({ user });

      const session = await auth.createSession(user.userId);

      console.log({ session });

      const authRequest = auth.handleRequest(
        event.request,
        event.request.headers
      );

      console.log({ authRequest });

      authRequest.setSession(session);

      console.log({ authRequest });
    } catch (error) {
      // username already used
      console.error({ error });
      throw new ServerError("username already used");
    }

    throw redirect("/", 302);
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

    const database = getDrizzle();
    const auth = getLuciaAuth(database);

    console.log({ auth, database, parsed });

    try {
      const authRequest = auth.handleRequest(
        event.request,
        event.request.headers
      );

      console.log({ authRequest });

      const key = await auth.useKey(
        "username",
        parsed.username,
        parsed.password
      );

      console.log({ key });

      const session = await auth.createSession(key.userId);

      console.log({ session });

      authRequest.setSession(session);

      console.log({ authRequest });
    } catch (error) {
      // invalid username/password
      console.error({ error });
      return new ServerError("invalid username/password");
    }

    throw redirect("/", 302);
  });
};

export const createSignOutServerAction = () => {
  return createServerAction$(async (_form: FormData, event) => {
    const database = getDrizzle();
    const auth = getLuciaAuth(database);

    const authRequest = auth.handleRequest(
      event.request,
      event.request.headers
    );

    const { session } = await authRequest.validateUser();

    if (!session) {
      throw redirect(paths.signIn, 302);
    }

    await auth.invalidateSession(session.sessionId);

    authRequest.setSession(null);

    throw redirect("/login", 302);
  });
};

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

    console.log({ auth, database });

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
    token: z.string(),
  });
};

export const createSignInServerAction = () => {
  return createServerAction$(
    async (form: FormData, { env, fetch, request }) => {
      const parsed = await zodFormParse({ form, schema: signInArgsSchema() });

      const cookie = await setSessionCookie({
        env,
        fetch,
        request,
        token: parsed.token,
      });

      return redirect(paths.timeSheets, { headers: { "Set-Cookie": cookie } });
    }
  );
};

export const createSignOutServerAction = () => {
  return createServerAction$(async (_form: FormData, { env, request }) => {
    const cookie = await destroySessionCookie({
      env,
      request,
    });

    return redirect(paths.home, { headers: { "Set-Cookie": cookie } });
  });
};

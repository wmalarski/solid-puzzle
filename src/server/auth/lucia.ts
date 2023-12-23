import { betterSqlite3 } from "@lucia-auth/adapter-sqlite";
import { lucia } from "lucia";
import { web } from "lucia/middleware";
import type { RequestEvent } from "solid-js/web";
import { getDrizzle, type DrizzleDB } from "../db";

const getLucia = (database: DrizzleDB["instance"]) => {
  return lucia({
    adapter: betterSqlite3(database, {
      key: "auth_key",
      session: "auth_session",
      user: "auth_user",
    }),
    env: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
    getUserAttributes: (user) => ({ username: user.username }),
    middleware: web(),
    sessionCookie: { expires: false },
  });
};

export type Auth = ReturnType<typeof getLucia>;

export const getLuciaAuth = (event: RequestEvent) => {
  return event.locals.auth as Auth;
};

export const luciaMiddleware: Middleware = ({ forward }) => {
  return (event) => {
    const { instance } = getDrizzle(event);
    const auth = getLucia(instance);
    event.locals.auth = auth;
    return forward(event);
  };
};

export const getSession = async (event: RequestEvent) => {
  const auth = getLuciaAuth(event);

  const authRequest = auth.handleRequest(event.request);

  const session = await authRequest.validate();

  return session;
};

export const getSessionOrThrow = async (event: RequestEvent) => {
  const session = await getSession(event);

  if (!session) {
    throw new ServerError("Unauthorized", { status: 404 });
  }

  return session;
};

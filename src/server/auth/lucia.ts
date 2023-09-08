import { betterSqlite3 } from "@lucia-auth/adapter-sqlite";
import { lucia } from "lucia";
import { web } from "lucia/middleware";
import { ServerError, type FetchEvent } from "solid-start";
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

type GetLuciaAuthArgs = Pick<FetchEvent, "env" | "locals">;

export type Auth = ReturnType<typeof getLucia>;

export const getLuciaAuth = (args: GetLuciaAuthArgs) => {
  const cached = args.locals.auth;
  if (cached) {
    return cached as Auth;
  }

  const { instance } = getDrizzle(args);
  const auth = getLucia(instance);

  args.locals.auth = auth;

  return auth;
};

type GetSessionArgs = Pick<FetchEvent, "env" | "locals" | "request">;

export const getSession = async (event: GetSessionArgs) => {
  const auth = getLuciaAuth(event);

  const authRequest = auth.handleRequest(event.request);

  const session = await authRequest.validate();

  return session;
};

export const getSessionOrThrow = async (event: GetSessionArgs) => {
  const session = await getSession(event);

  if (!session) {
    throw new ServerError("Unauthorized", { status: 404 });
  }

  return session;
};

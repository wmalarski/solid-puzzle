import { betterSqlite3 } from "@lucia-auth/adapter-sqlite";
import lucia from "lucia-auth";
import { web } from "lucia-auth/middleware";
import type { FetchEvent } from "solid-start";
import { getDrizzle, type DrizzleDB } from "~/db/db";

const getLucia = (database: DrizzleDB["database"]) => {
  return lucia({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adapter: betterSqlite3(database as any),
    env: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
    middleware: web(),
    transformDatabaseUser: (user) => ({
      lastNames: user.last_names,
      names: user.names,
      userId: user.id,
      username: user.username,
    }),
  });
};

export type Auth = ReturnType<typeof getLucia>;

export const getLuciaAuth = (event: FetchEvent) => {
  const db = getDrizzle(event);

  if (event.locals.auth) {
    return event.locals.auth as Auth;
  }

  const auth = getLucia(db.database);

  event.locals.auth = auth;

  return auth;
};

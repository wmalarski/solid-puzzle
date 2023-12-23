import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import type { RequestEvent } from "solid-js/web";
import type { Middleware } from "solid-start/entry-server";
import { user } from "~/server/auth/schema";
import { board } from "~/server/board/schema";
import { serverEnv } from "./env";

const createDrizzleContext = (event: RequestEvent) => {
  const env = serverEnv(event);
  const instance = Database(env.DATABASE_URL);
  return {
    db: drizzle(instance),
    instance,
    schema: { board, user },
  };
};

export type DrizzleDB = ReturnType<typeof createDrizzleContext>;

declare global {
  // eslint-disable-next-line no-var
  var db: DrizzleDB;
}

const getDrizzleCached = (event: RequestEvent) => {
  const env = serverEnv(event);

  // HOT reload cache
  if (env.NODE_ENV !== "production" && typeof global !== "undefined") {
    if (!global.db) {
      const drizzle = createDrizzleContext(event);
      global.db = drizzle;
    }
    return global.db;
  }

  return createDrizzleContext(event);
};

export const getDrizzle = (event: RequestEvent) => {
  return event.locals.drizzle as DrizzleDB;
};

export const drizzleMiddleware: Middleware = ({ forward }) => {
  return (event) => {
    const drizzle = getDrizzleCached(event);
    event.locals.drizzle = drizzle;
    return forward(event);
  };
};

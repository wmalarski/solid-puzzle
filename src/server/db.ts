import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import type { FetchEvent } from "solid-start";
import { serverEnv } from "~/env/serverEnv";
import { user } from "~/server/auth/schema";
import { board } from "~/server/board/schema";

type CreateDrizzleArgs = Pick<FetchEvent, "env" | "locals">;

const createDrizzle = (args: CreateDrizzleArgs) => {
  const env = serverEnv(args);
  const instance = Database(env.DATABASE_URL);
  return {
    db: drizzle(instance),
    instance,
    schema: { board, user },
  };
};

export type DrizzleDB = ReturnType<typeof createDrizzle>;

declare global {
  // eslint-disable-next-line no-var
  var db: DrizzleDB;
}

export const getDrizzle = (args: CreateDrizzleArgs) => {
  const cached = args.locals.drizzle;
  if (cached) {
    return cached as DrizzleDB;
  }

  // HOT reload cache
  const env = serverEnv(args);
  if (env.NODE_ENV !== "production" && typeof global !== "undefined") {
    if (!global.db) {
      const drizzle = createDrizzle(args);
      global.db = drizzle;
      args.locals.drizzle = drizzle;
    }
    return global.db;
  }

  const drizzle = createDrizzle(args);
  args.locals.drizzle = drizzle;
  return drizzle;
};

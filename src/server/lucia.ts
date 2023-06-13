import { betterSqlite3 } from "@lucia-auth/adapter-sqlite";
import lucia from "lucia-auth";
import { web } from "lucia-auth/middleware";
import type { DrizzleDB } from "~/db/db";

export const getLuciaAuth = ({ database }: DrizzleDB) => {
  return lucia({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adapter: betterSqlite3(database as any),
    env: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
    middleware: web(),
    transformDatabaseUser: (user) => ({
      last_names: user.last_names,
      names: user.names,
      userId: user.id,
      username: user.username,
    }),
  });
};

export type Auth = ReturnType<typeof getLuciaAuth>;

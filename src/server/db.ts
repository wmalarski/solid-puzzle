/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { FetchEvent } from "@solidjs/start/server/types";
import type { RequestEvent } from "solid-js/web";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import { user } from "~/server/auth/schema";
import { board } from "~/server/board/schema";

const createDrizzleContext = (event: RequestEvent) => {
  const instance = Database(event.context.env.DATABASE_URL);
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

export const getDrizzleCached = (event: RequestEvent) => {
  // HOT reload cache
  if (
    event.context.env.NODE_ENV !== "production" &&
    typeof global !== "undefined"
  ) {
    if (!global.db) {
      const drizzle = createDrizzleContext(event);
      global.db = drizzle;
    }
    return global.db;
  }

  return createDrizzleContext(event);
};

export const drizzleMiddleware = (event: FetchEvent) => {
  const drizzle = getDrizzleCached(event);
  event.context.db = drizzle.db;
  event.context.instance = drizzle.instance;
  event.context.schema = drizzle.schema;
};

declare module "vinxi/server" {
  interface H3EventContext {
    db: DrizzleDB["db"];
    instance: DrizzleDB["instance"];
    schema: DrizzleDB["schema"];
  }
}

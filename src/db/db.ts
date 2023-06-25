import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import type { FetchEvent } from "solid-start";

const createDrizzle = () => {
  const database = Database("sqlite.db");
  return { database, drizzle: drizzle(database) };
};

export type DrizzleDB = ReturnType<typeof createDrizzle>;

declare global {
  // eslint-disable-next-line no-var
  var db: DrizzleDB;
}

export const getDrizzle = (event: FetchEvent) => {
  if (event.locals.drizzle) {
    return event.locals.drizzle as DrizzleDB;
  }

  // HOT reload cache
  const env = event.env.__dev;
  console.log({ env });
  if (process.env.NODE_ENV !== "production" && typeof global !== "undefined") {
    if (!global.db) {
      const drizzle = createDrizzle();

      console.log("global", { drizzle });

      global.db = drizzle;
      event.locals.drizzle = drizzle;
    }
    return global.db;
  }

  const drizzle = createDrizzle();

  console.log("out", { drizzle });

  event.locals.drizzle = drizzle;

  return drizzle;
};

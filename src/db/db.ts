import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

const createDrizzle = () => {
  const database = Database("sqlite.db");
  return { database, drizzle: drizzle(database) };
};

export type DrizzleDB = ReturnType<typeof createDrizzle>;

declare global {
  // eslint-disable-next-line no-var
  var db: DrizzleDB;
}

export const getDrizzle = () => {
  // HOT reload cache
  if (process.env.NODE_ENV !== "production" && typeof global !== "undefined") {
    if (!global.db) {
      global.db = createDrizzle();
    }
    return global.db;
  }
  return createDrizzle();
};

import Database from "better-sqlite3";
import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

dotenv.config();

const runMigrations = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("Invalid connectionString");
  }

  const database = Database(connectionString);

  const db = drizzle(database);

  migrate(db, { migrationsFolder: "./migrations" });
};

runMigrations();

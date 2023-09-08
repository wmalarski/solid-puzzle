import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("auth_user", {
  id: text("id").primaryKey(),
  lastNames: text("last_names"),
  names: text("names"),
  username: text("username"),
});

export const session = sqliteTable("auth_session", {
  activeExpires: integer("active_expires").notNull(),
  id: text("id").primaryKey(),
  idleExpires: integer("idle_expires").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const key = sqliteTable("auth_key", {
  hashedPassword: text("hashed_password"),
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

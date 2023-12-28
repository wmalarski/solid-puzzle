import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("auth_user", {
  id: text("id").primaryKey(),
  password: text("password"),
  username: text("username"),
});

export const session = sqliteTable("auth_session", {
  expiresAt: integer("expires_at").notNull(),
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

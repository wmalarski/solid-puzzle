import { sql } from "drizzle-orm";
import { numeric, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "../auth/schema";

export const board = sqliteTable("game_room", {
  config: text("config").notNull(),
  createdAt: numeric("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  id: text("id").primaryKey(),
  media: text("media").notNull(),
  name: text("name").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id),
  updatedAt: numeric("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// We will store our chat messages within "spaces".
// Each space has a version that increments for each push processed.
// Note that in many applications there is already some domain object that
// already fills the role of a "space". In that case, that table can double
// as the space table.
export const space = sqliteTable("space", {
  key: text("id").primaryKey().notNull(),
  version: integer("version"),
});

// await t.none(`create table space (
//         key text not null unique primary key,
//         version integer)`);
// await t.none(
//   `insert into space (key, version) values ('${defaultSpaceID}', 0)`
// );

// Stores chat messages.
export const message = sqliteTable("message", {
  content: text("content").notNull(),
  deleted: int("deleted").notNull(),
  id: text("id").primaryKey().notNull(),
  ord: integer("ord").notNull(),
  sender: text("sender", { length: 255 }).notNull(),
  space_id: text("space_id")
    .notNull()
    .references(() => space.key),
  version: integer("version").notNull(),
});

// Stores last mutationID processed for each Replicache client.
export const replicacheClient = sqliteTable("replicache_client", {
  id: text("id", { length: 36 }).primaryKey().notNull(),
  last_mutation_id: integer("last_mutation_id").notNull(),
});

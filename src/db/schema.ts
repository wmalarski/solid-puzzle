import { int, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
  expires: integer("expires"),
  hashedPassword: text("hashed_password"),
  id: text("id").primaryKey(),
  primaryKey: integer("primary_key").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
});

export const board = sqliteTable("game_room", {
  config: text("config").notNull(),
  id: text("id").primaryKey(),
  media: text("media").notNull(),
  name: text("name").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id),
});

export const space = sqliteTable("space", {
  key: text("id").primaryKey().notNull(),
  version: integer("version"),
});

// We will store our chat messages within "spaces".
// Each space has a version that increments for each push processed.
// Note that in many applications there is already some domain object that
// already fills the role of a "space". In that case, that table can double
// as the space table.
await t.none(`create table space (
        key text not null unique primary key,
        version integer)`);
await t.none(
  `insert into space (key, version) values ('${defaultSpaceID}', 0)`
);

// Stores chat messages.
await t.none(`create table message (
      id text primary key not null,
      space_id text not null references space(key),
      sender varchar(255) not null,
      content text not null,
      ord integer not null,
      deleted boolean not null,
      version integer not null)`);

export const message = sqliteTable("message", {
  id: text("id").primaryKey().notNull(),
  space_id: text("space_id")
    .notNull()
    .references(() => space.key),
  sender: text("sender", { length: 255 }).notNull(),
  content: text("content").notNull(),
  ord: integer("ord").notNull(),
  deleted: int("deleted").notNull(),
  version: integer("version").notNull(),

  media: text("media").notNull(),
  name: text("name").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id),
});

// Stores last mutationID processed for each Replicache client.
export const replicacheClient = sqliteTable("replicache_client", {
  id: text("id", { length: 36 }).primaryKey().notNull(),
  last_mutation_id: integer("last_mutation_id").notNull(),
});

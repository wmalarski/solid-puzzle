import { eq } from "drizzle-orm";
import type { RequestContext } from "../context";

type SelectSpaceVersionArgs = {
  ctx: RequestContext;
  spaceId: string;
};

export const selectSpaceVersion = (args: SelectSpaceVersionArgs) => {
  return args.ctx.db
    .select()
    .from(args.ctx.schema.space)
    .where(eq(args.ctx.schema.space.key, args.spaceId))
    .get();
};

type UpdateSpaceVersionArgs = {
  ctx: RequestContext;
  spaceId: string;
  version: number;
};

export const updateSpaceVersion = (args: UpdateSpaceVersionArgs) => {
  return args.ctx.db
    .update(args.ctx.schema.space)
    .set({ version: args.version })
    .where(eq(args.ctx.schema.space.key, args.spaceId))
    .run();
};

type InsertMessageArgs = {
  content: string;
  ctx: RequestContext;
  from: string;
  id: string;
  order: number;
  spaceId: string;
  version: number;
};

export const insertMessage = (args: InsertMessageArgs) => {
  return args.ctx.db
    .insert(args.ctx.schema.message)
    .values({
      content: args.content,
      deleted: 0,
      id: args.id,
      ord: args.order,
      sender: args.from,
      space_id: args.spaceId,
      version: args.version,
    })
    .run();
};

type SelectLastMutationIdArgs = {
  clientId: string;
  ctx: RequestContext;
  required: boolean;
};

export const selectLastMutationId = (args: SelectLastMutationIdArgs) => {
  const clientRow = args.ctx.db
    .select()
    .from(args.ctx.schema.replicacheClient)
    .where(eq(args.ctx.schema.replicacheClient.id, args.clientId))
    .limit(1)
    .all()?.[0];

  if (!clientRow) {
    // If the client is unknown ensure the request is from a new client. If it
    // isn't, data has been deleted from the server, which isn't supported:
    // https://github.com/rocicorp/replicache/issues/1033.
    if (args.required) {
      throw new Error(`client not found: ${args.clientId}`);
    }
    return 0;
  }
  return clientRow.last_mutation_id;
};

type UpsertLastMutationIdArgs = {
  clientId: string;
  ctx: RequestContext;
  mutationId: number;
};

export const upsertLastMutationId = (args: UpsertLastMutationIdArgs) => {
  const result = args.ctx.db
    .update(args.ctx.schema.replicacheClient)
    .set({ last_mutation_id: args.mutationId })
    .where(eq(args.ctx.schema.replicacheClient.id, args.clientId))
    .run();

  if (result.changes === 0) {
    args.ctx.db
      .insert(args.ctx.schema.replicacheClient)
      .values({ id: args.clientId, last_mutation_id: args.mutationId })
      .run();
  }
};

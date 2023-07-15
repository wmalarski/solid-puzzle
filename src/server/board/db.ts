import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { ServerError } from "solid-start/server";
import { z } from "zod";
import { generateCurves } from "~/utils/getPuzzleFragments";
import { type ProtectedRequestContext, type RequestContext } from "../context";

export const insertBoardArgsSchema = () => {
  return z.object({
    columns: z.coerce.number().int().min(3),
    image: z.string(),
    name: z.string().min(3),
    rows: z.coerce.number().int().min(3),
  });
};

type InsertBoardArgs = z.infer<ReturnType<typeof insertBoardArgsSchema>> & {
  ctx: ProtectedRequestContext;
};

export const insertBoard = (args: InsertBoardArgs) => {
  const boardId = nanoid();
  const config = generateCurves({
    columns: args.columns,
    rows: args.rows,
  });

  args.ctx.db
    .insert(args.ctx.schema.board)
    .values({
      config: JSON.stringify(config),
      id: boardId,
      media: args.image,
      name: args.name,
      ownerId: args.ctx.session.userId,
    })
    .run();

  return boardId;
};

export const updateBoardArgsSchema = () => {
  return z.object({
    columns: z.coerce.number().int().min(3),
    id: z.string(),
    image: z.string(),
    name: z.string().min(3),
    rows: z.coerce.number().int().min(3),
  });
};

type UpdateBoardArgs = z.infer<ReturnType<typeof updateBoardArgsSchema>> & {
  ctx: ProtectedRequestContext;
};

export const updateBoard = (args: UpdateBoardArgs) => {
  const board = args.ctx.db
    .select()
    .from(args.ctx.schema.board)
    .where(eq(args.ctx.schema.board.id, args.id))
    .limit(1)
    .get();

  if (args.ctx.session.userId !== board.ownerId) {
    throw new ServerError("Unauthorized", { status: 404 });
  }

  const config = generateCurves({
    columns: args.columns,
    rows: args.rows,
  });

  const result = args.ctx.db
    .update(args.ctx.schema.board)
    .set({ config: JSON.stringify(config), media: args.image, name: args.name })
    .where(eq(args.ctx.schema.board.id, args.id))
    .run();

  return result.changes;
};

export const deleteBoardArgsSchema = () => {
  return z.object({ id: z.string() });
};

type DeleteBoardArgs = z.infer<ReturnType<typeof deleteBoardArgsSchema>> & {
  ctx: ProtectedRequestContext;
};

export const deleteBoard = (args: DeleteBoardArgs) => {
  const board = args.ctx.db
    .select()
    .from(args.ctx.schema.board)
    .where(eq(args.ctx.schema.board.id, args.id))
    .limit(1)
    .get();

  if (args.ctx.session.userId !== board.ownerId) {
    throw new ServerError("Unauthorized", { status: 404 });
  }

  args.ctx.db
    .delete(args.ctx.schema.board)
    .where(eq(args.ctx.schema.board.id, args.id))
    .run();

  return board;
};

export const selectBoardArgsSchema = () => {
  return z.object({ id: z.string() });
};

type SelectBoardArgs = z.infer<ReturnType<typeof selectBoardArgsSchema>> & {
  ctx: RequestContext;
};

export const selectBoard = (args: SelectBoardArgs) => {
  try {
    const result = args.ctx.db
      .select()
      .from(args.ctx.schema.board)
      .where(eq(args.ctx.schema.board.id, args.id))
      .limit(1)
      .all();

    return result[0] || null;
  } catch (error) {
    return null;
  }
};

export const selectBoardsArgsSchema = () => {
  return z.object({
    limit: z.coerce.number().max(20),
    offset: z.coerce.number(),
  });
};

type SelectBoardsArgs = z.infer<ReturnType<typeof selectBoardsArgsSchema>> & {
  ctx: ProtectedRequestContext;
};

export const selectBoards = (args: SelectBoardsArgs) => {
  try {
    const result = args.ctx.db
      .select()
      .from(args.ctx.schema.board)
      .where(eq(args.ctx.schema.board.ownerId, args.ctx.session.userId))
      .limit(args.limit)
      .offset(args.offset)
      .all();

    return result;
  } catch (error) {
    return null;
  }
};

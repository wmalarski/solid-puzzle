import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import {
  coerce,
  integer,
  maxValue,
  minLength,
  minValue,
  number,
  object,
  string,
  type Input,
} from "valibot";
import { generateCurves } from "~/utils/getPuzzleFragments";
import type { ProtectedRequestContext, RequestContext } from "../context";

export const insertBoardArgsSchema = () => {
  return object({
    columns: coerce(number([integer(), minValue(3)]), Number),
    image: string(),
    name: string([minLength(3)]),
    rows: coerce(number([integer(), minValue(3)]), Number),
  });
};

type InsertBoardArgs = Input<ReturnType<typeof insertBoardArgsSchema>> & {
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
      ownerId: args.ctx.session.user.userId,
    })
    .run();

  return boardId;
};

export const updateBoardArgsSchema = () => {
  return object({
    columns: coerce(number([integer(), minValue(3)]), Number),
    id: string(),
    image: string(),
    name: string([minLength(3)]),
    rows: coerce(number([integer(), minValue(3)]), Number),
  });
};

type UpdateBoardArgs = Input<ReturnType<typeof updateBoardArgsSchema>> & {
  ctx: ProtectedRequestContext;
};

export const updateBoard = (args: UpdateBoardArgs) => {
  const board = args.ctx.db
    .select()
    .from(args.ctx.schema.board)
    .where(eq(args.ctx.schema.board.id, args.id))
    .limit(1)
    .get();

  if (args.ctx.session.user.userId !== board?.ownerId) {
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
  return object({ id: string() });
};

type DeleteBoardArgs = Input<ReturnType<typeof deleteBoardArgsSchema>> & {
  ctx: ProtectedRequestContext;
};

export const deleteBoard = (args: DeleteBoardArgs) => {
  const board = args.ctx.db
    .select()
    .from(args.ctx.schema.board)
    .where(eq(args.ctx.schema.board.id, args.id))
    .limit(1)
    .get();

  if (args.ctx.session.user.userId !== board?.ownerId) {
    throw new ServerError("Unauthorized", { status: 404 });
  }

  args.ctx.db
    .delete(args.ctx.schema.board)
    .where(eq(args.ctx.schema.board.id, args.id))
    .run();

  return board;
};

export const selectBoardArgsSchema = () => {
  return object({ id: string() });
};

type SelectBoardArgs = Input<ReturnType<typeof selectBoardArgsSchema>> & {
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
  return object({
    limit: coerce(number([maxValue(20)]), Number),
    offset: coerce(number(), Number),
  });
};

type SelectBoardsArgs = Input<ReturnType<typeof selectBoardsArgsSchema>> & {
  ctx: ProtectedRequestContext;
};

export const selectBoards = (args: SelectBoardsArgs) => {
  try {
    const result = args.ctx.db
      .select()
      .from(args.ctx.schema.board)
      .where(eq(args.ctx.schema.board.ownerId, args.ctx.session.user.userId))
      .limit(args.limit)
      .offset(args.offset)
      .all();

    return result;
  } catch (error) {
    return null;
  }
};

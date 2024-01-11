import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

import { generateCurves } from "~/utils/getPuzzleFragments";

import type {
  WithH3EventContext,
  WithProtectedH3EventContext,
} from "../context";

type InsertBoardArgs = WithProtectedH3EventContext<{
  columns: number;
  image: string;
  name: string;
  rows: number;
}>;

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

type UpdateBoardArgs = WithProtectedH3EventContext<{
  columns: number;
  id: string;
  image: string;
  name: string;
  rows: number;
}>;

export const updateBoard = (args: UpdateBoardArgs) => {
  const board = args.ctx.db
    .select()
    .from(args.ctx.schema.board)
    .where(eq(args.ctx.schema.board.id, args.id))
    .limit(1)
    .get();

  if (args.ctx.session.userId !== board?.ownerId) {
    throw new Response("Unauthorized", { status: 404 });
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

type DeleteBoardArgs = WithProtectedH3EventContext<{
  id: string;
}>;

export const deleteBoard = (args: DeleteBoardArgs) => {
  const board = args.ctx.db
    .select()
    .from(args.ctx.schema.board)
    .where(eq(args.ctx.schema.board.id, args.id))
    .limit(1)
    .get();

  if (args.ctx.session.userId !== board?.ownerId) {
    throw new Response("Unauthorized", { status: 404 });
  }

  args.ctx.db
    .delete(args.ctx.schema.board)
    .where(eq(args.ctx.schema.board.id, args.id))
    .run();

  return board;
};

type SelectBoardArgs = WithH3EventContext<{
  id: string;
}>;

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

type SelectBoardsArgs = WithProtectedH3EventContext<{
  limit: number;
  offset: number;
}>;

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

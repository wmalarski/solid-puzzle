import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import server$, {
  ServerError,
  createServerAction$,
  redirect,
  useRequest,
} from "solid-start/server";
import { z } from "zod";
import { generateCurves } from "~/utils/getPuzzleFragments";
import { getImageShape } from "~/utils/images";
import { paths } from "~/utils/paths";
import { getProtectedRequestContext, getRequestContext } from "./context";
import { zodFormParse } from "./utils";

const insertBoardArgsSchema = () => {
  return z.object({
    columns: z.coerce.number().int().min(3),
    image: z.string(),
    name: z.string().min(3),
    rows: z.coerce.number().int().min(3),
  });
};

export const insertBoardAction = () => {
  return createServerAction$(async (form: FormData, event) => {
    const parsed = await zodFormParse({
      form,
      schema: insertBoardArgsSchema(),
    });

    const ctx = await getProtectedRequestContext(event);

    const boardId = nanoid();
    const { height, width } = getImageShape(parsed.image);
    const config = generateCurves({
      columns: parsed.columns,
      height,
      rows: parsed.rows,
      width,
    });

    ctx.db
      .insert(ctx.schema.board)
      .values({
        config: JSON.stringify(config),
        id: boardId,
        media: parsed.image,
        name: parsed.name,
        ownerId: ctx.session.userId,
      })
      .run();

    throw redirect(paths.board(boardId));
  });
};

const updateBoardArgsSchema = () => {
  return z.object({
    config: z
      .object({
        columns: z.coerce.number().int().min(3),
        image: z.string(),
        rows: z.coerce.number().int().min(3),
      })
      .optional(),
    id: z.string(),
    name: z.string().min(3).optional(),
  });
};

export const updateBoardAction = () => {
  return createServerAction$(async (form: FormData, event) => {
    const parsed = await zodFormParse({
      form,
      schema: updateBoardArgsSchema(),
    });

    const ctx = await getProtectedRequestContext(event);

    const board = ctx.db
      .select()
      .from(ctx.schema.board)
      .where(eq(ctx.schema.board.id, parsed.id))
      .limit(1)
      .get();

    if (ctx.session.userId !== board.ownerId) {
      throw new ServerError("Unauthorized", { status: 404 });
    }

    let config;
    if (parsed.config) {
      const { height, width } = getImageShape(parsed.config.image);
      config = generateCurves({
        columns: parsed.config.columns,
        height,
        rows: parsed.config.rows,
        width,
      });
    }

    const result = ctx.db
      .update(ctx.schema.board)
      .set({ config: JSON.stringify(config), name: parsed.name })
      .where(eq(ctx.schema.board.id, parsed.id))
      .run();

    return result.changes;
  });
};

const deleteBoardArgsSchema = () => {
  return z.object({ id: z.string() });
};

export const deleteBoardAction = () => {
  return createServerAction$(async (form: FormData, event) => {
    const parsed = await zodFormParse({
      form,
      schema: deleteBoardArgsSchema(),
    });

    const ctx = await getProtectedRequestContext(event);

    const board = ctx.db
      .select()
      .from(ctx.schema.board)
      .where(eq(ctx.schema.board.id, parsed.id))
      .limit(1)
      .get();

    if (ctx.session.userId !== board.ownerId) {
      throw new ServerError("Unauthorized", { status: 404 });
    }

    ctx.db
      .delete(ctx.schema.board)
      .where(eq(ctx.schema.board.id, parsed.id))
      .run();

    return board;
  });
};

const getBoardArgsSchema = () => {
  return z.object({ id: z.string() });
};

type GetBoardArgs = z.infer<ReturnType<typeof getBoardArgsSchema>>;

export const getBoardKey = (args: GetBoardArgs) => {
  return ["getBoard", args] as const;
};

export const getBoardServerQuery = server$(
  async ([, args]: ReturnType<typeof getBoardKey>) => {
    const parsed = getBoardArgsSchema().parse(args);

    const event = useRequest();
    const ctx = await getRequestContext({
      env: event.env || server$.env,
      locals: event.locals || server$.locals,
      request: event.request || server$.request,
    });

    try {
      const result = ctx.db
        .select()
        .from(ctx.schema.board)
        .where(eq(ctx.schema.board.id, parsed.id))
        .limit(1)
        .all();

      return result[0] || null;
    } catch (error) {
      return null;
    }
  }
);

const getBoardsArgsSchema = () => {
  return z.object({
    limit: z.coerce.number().max(20),
    offset: z.coerce.number(),
  });
};

type GetBoardsArgs = z.infer<ReturnType<typeof getBoardsArgsSchema>>;

export const getBoardsKey = (args: GetBoardsArgs) => {
  return ["getBoards", args] as const;
};

export const getBoardsServerQuery = server$(
  async ([, args]: ReturnType<typeof getBoardsKey>) => {
    const parsed = getBoardsArgsSchema().parse(args);

    const event = useRequest();
    const ctx = await getProtectedRequestContext({
      env: event.env || server$.env,
      locals: event.locals || server$.locals,
      request: event.request || server$.request,
    });

    try {
      const result = ctx.db
        .select()
        .from(ctx.schema.board)
        .where(eq(ctx.schema.board.ownerId, ctx.session.userId))
        .limit(parsed.limit)
        .offset(parsed.offset)
        .all();

      return result;
    } catch (error) {
      return null;
    }
  }
);
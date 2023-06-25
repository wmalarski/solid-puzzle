import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import server$, {
  createServerAction$,
  redirect,
  useRequest,
} from "solid-start/server";
import { z } from "zod";
import { getDrizzle } from "~/db/db";
import { boardTable } from "~/db/schema";
import { generateCurves } from "~/utils/getPuzzleFragments";
import { getImageShape } from "~/utils/images";
import { paths } from "~/utils/paths";
import { getSessionOrThrow } from "./lucia";
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

    const { drizzle } = getDrizzle(event);
    const { session } = await getSessionOrThrow(event);

    const boardId = nanoid();
    const { height, width } = getImageShape(parsed.image);
    const config = generateCurves({
      columns: parsed.columns,
      height,
      rows: parsed.rows,
      width,
    });

    drizzle
      .insert(boardTable)
      .values({
        config: JSON.stringify(config),
        id: boardId,
        media: parsed.image,
        name: parsed.name,
        ownerId: session.userId,
      })
      .run();

    throw redirect(paths.board(boardId));
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
  ([, args]: ReturnType<typeof getBoardKey>) => {
    const parsed = getBoardArgsSchema().parse(args);

    const event = useRequest();

    try {
      const { drizzle } = getDrizzle(event);

      const result = drizzle
        .select()
        .from(boardTable)
        .where(eq(boardTable.id, parsed.id))
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

    try {
      const { drizzle } = getDrizzle(event);
      const { session } = await getSessionOrThrow(event);

      console.log({ drizzle });

      const result = drizzle
        .select()
        .from(boardTable)
        .where(eq(boardTable.ownerId, session.userId))
        .limit(parsed.limit)
        .offset(parsed.offset)
        .all();

      return result;
    } catch (error) {
      console.log({ error });
      return null;
    }
  }
);

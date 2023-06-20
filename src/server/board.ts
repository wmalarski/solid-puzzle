import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import server$, { createServerAction$, useRequest } from "solid-start/server";
import { z } from "zod";
import { getDrizzle } from "~/db/db";
import { boardTable } from "~/db/schema";
import { generateCurves } from "~/utils/getPuzzleFragments";
import { getImageShape } from "~/utils/images";
import { getSessionOrThrow } from "./auth";
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
        id: nanoid(),
        media: parsed.image,
        name: parsed.name,
        ownerId: session.userId,
      })
      .returning();
  });
};

const getBoardArgsSchema = () => {
  return z.object({ id: z.string() });
};

type GetBoardArgs = z.infer<ReturnType<typeof getBoardArgsSchema>>;

export const getBoardKey = (args: GetBoardArgs) => {
  return ["getBoardKey", args] as const;
};

export const getAllBoardsKey = () => {
  return ["getBoardKey"] as const;
};

export const getBoardServerQuery = server$(
  ([, args]: ReturnType<typeof getBoardKey>) => {
    const parsed = getBoardArgsSchema().parse(args);

    const event = useRequest();

    const { drizzle } = getDrizzle(event);

    return drizzle
      .select()
      .from(boardTable)
      .where(eq(boardTable.id, parsed.id))
      .limit(1)
      .get();
  }
);

import type { InferModel } from "drizzle-orm";
import type { board } from "~/server/board/schema";

export type BoardModel = InferModel<typeof board>;

import type { InferModel } from "drizzle-orm";
import type { board } from "./schema";

export type UpdateModel<T extends { id: string }> = Partial<T> & { id: string };

export type BoardModel = InferModel<typeof board>;
export type BoardInsert = InferModel<typeof board, "insert">;
export type BoardUpdate = UpdateModel<InferModel<typeof board>>;

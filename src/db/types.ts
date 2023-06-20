import type { InferModel } from "drizzle-orm";
import type { boardTable } from "./schema";

export type UpdateModel<T extends { id: string }> = Partial<T> & { id: string };

export type BoardModel = InferModel<typeof boardTable>;
export type BoardInsert = InferModel<typeof boardTable, "insert">;
export type BoardUpdate = UpdateModel<InferModel<typeof boardTable>>;

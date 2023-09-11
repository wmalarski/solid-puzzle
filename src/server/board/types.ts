import type { board } from "~/server/board/schema";

export type BoardModel = typeof board._.inferSelect;

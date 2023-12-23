import { queryOptions } from "@tanstack/solid-query";
import type { Input } from "valibot";
import { selectBoardServerQuery, selectBoardsServerQuery } from "./actions";
import type { selectBoardArgsSchema, selectBoardsArgsSchema } from "./db";
import type { BoardModel } from "./types";

export const selectBoardServerQueryOptions = (
  args: Input<ReturnType<typeof selectBoardArgsSchema>>,
  initialBoard?: BoardModel,
) => {
  return queryOptions(() => ({
    initialData: initialBoard,
    queryFn: () => selectBoardServerQuery(args),
    queryKey: ["selectBoard", args] as const,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  }));
};

export const selectBoardsServerQueryOptions = (
  args: Input<ReturnType<typeof selectBoardsArgsSchema>>,
) => {
  return queryOptions(() => ({
    queryFn: () => selectBoardsServerQuery(args),
    queryKey: ["selectBoards", args] as const,
  }));
};

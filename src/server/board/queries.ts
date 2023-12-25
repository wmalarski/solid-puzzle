import { queryOptions } from "@tanstack/solid-query";
import { selectBoardServerQuery, selectBoardsServerQuery } from "./actions";

import type { BoardModel } from "./types";

export const selectBoardServerQueryOptions = ({
  initialBoard,
  ...args
}: Awaited<Parameters<typeof selectBoardServerQuery>[0]> & {
  initialBoard?: BoardModel;
}) => {
  return queryOptions(() => ({
    initialData: initialBoard,
    queryFn: () => selectBoardServerQuery(args),
    queryKey: ["selectBoard", args] as const,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  }));
};

export const selectBoardsServerQueryOptions = (
  args: Awaited<Parameters<typeof selectBoardsServerQuery>[0]>,
) => {
  return queryOptions(() => ({
    queryFn: () => selectBoardsServerQuery(args),
    queryKey: ["selectBoards", args] as const,
  }));
};

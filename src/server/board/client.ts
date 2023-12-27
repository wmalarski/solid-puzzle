import { action, cache } from "@solidjs/router";
import { queryOptions } from "@tanstack/solid-query";
import {
  deleteBoardServerAction,
  insertBoardServerAction,
  selectBoardServerLoader,
  selectBoardsServerLoader,
  updateBoardServerAction,
} from "./actions";
import type { BoardModel } from "./types";

const SELECT_BOARD_CACHE_NAME = "board";
const SELECT_BOARDS_CACHE_NAME = "boards";

export const insertBoardAction = action(
  insertBoardServerAction,
  "insertBoardAction",
);
export const updateBoardAction = action(
  updateBoardServerAction,
  "updateBoardAction",
);

export const deleteBoardAction = action(
  deleteBoardServerAction,
  "deleteBoardAction",
);

export const selectBoardLoader = cache(
  selectBoardServerLoader,
  SELECT_BOARD_CACHE_NAME,
);

export const selectBoardsLoader = cache(
  selectBoardsServerLoader,
  SELECT_BOARDS_CACHE_NAME,
);

export const selectBoardQueryOptions = ({
  initialBoard,
  ...args
}: Awaited<Parameters<typeof selectBoardLoader>[0]> & {
  initialBoard?: BoardModel;
}) => {
  return queryOptions(() => ({
    initialData: initialBoard,
    queryFn: () => selectBoardLoader(args),
    queryKey: ["selectBoard", args] as const,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  }));
};

export const selectBoardsQueryOptions = (
  args: Awaited<Parameters<typeof selectBoardsLoader>[0]>,
) => {
  return queryOptions(() => ({
    queryFn: () => selectBoardsLoader(args),
    queryKey: ["selectBoards", args] as const,
  }));
};

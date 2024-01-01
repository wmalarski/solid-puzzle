import { cache } from "@solidjs/router";
import {
  queryOptions,
  type InvalidateQueryFilters,
} from "@tanstack/solid-query";
import {
  selectBoardServerLoader,
  selectBoardsServerLoader,
  selectProtectedBoardServerLoader,
} from "./rpc";
import type { BoardModel } from "./types";

const SELECT_BOARD_CACHE_NAME = "board";
const SELECT_PROTECTED_BOARD_CACHE_NAME = "protected-board";
const SELECT_BOARDS_CACHE_NAME = "boards";

export const SELECT_BOARDS_DEFAULT_LIMIT = 10;

export const selectBoardLoader = cache(
  selectBoardServerLoader,
  SELECT_BOARD_CACHE_NAME,
);

export const selectProtectedBoardLoader = cache(
  selectProtectedBoardServerLoader,
  SELECT_PROTECTED_BOARD_CACHE_NAME,
);

export const selectBoardsLoader = cache(
  selectBoardsServerLoader,
  SELECT_BOARDS_CACHE_NAME,
);

export const selectBoardQueryOptions = ({
  initialBoard,
  ...args
}: Parameters<typeof selectBoardLoader>[0] & {
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

export const invalidateSelectBoardQuery = (
  boardId: string,
): InvalidateQueryFilters => {
  const options = selectBoardQueryOptions({ id: boardId })();
  return { queryKey: options.queryKey };
};

export const selectBoardsQueryOptions = (
  args: Parameters<typeof selectBoardsLoader>[0],
) => {
  return queryOptions(() => ({
    queryFn: () => selectBoardsLoader(args),
    queryKey: ["selectBoards", args] as const,
  }));
};

export const invalidateSelectBoardsQueries = (): InvalidateQueryFilters => {
  const options = selectBoardsQueryOptions({ limit: 0, offset: 0 })();
  return { queryKey: options.queryKey.slice(0, 1) };
};

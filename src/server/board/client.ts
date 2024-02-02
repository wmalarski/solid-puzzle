import { action, cache } from "@solidjs/router";
import {
  type InvalidateQueryFilters,
  queryOptions
} from "@tanstack/solid-query";

import { useSessionContext } from "~/contexts/SessionContext";
import { useSupabase } from "~/contexts/SupabaseContext";
import {
  BOARDS_ACCESS_CACHE_KEY,
  INSERT_BOARD_ARGS_CACHE_KEY
} from "~/server/board/const";
import {
  deleteBoardServerAction,
  getBoardAccessServerLoader,
  getInsertBoardArgsServerLoader,
  insertBoardServerAction,
  setBoardAccessServerAction,
  updateBoardServerAction
} from "~/server/board/rpc";

export const SELECT_BOARDS_DEFAULT_LIMIT = 10;

type SelectBoardQueryOptionsArgs = {
  id: string;
};

export const selectBoardQueryOptions = ({
  id
}: SelectBoardQueryOptionsArgs) => {
  const supabase = useSupabase();

  return queryOptions(() => ({
    queryFn: async () => {
      const result = await supabase()
        .from("rooms")
        .select()
        .eq("id", id)
        .single();

      if (result.error) {
        throw result.error;
      }

      return result.data;
    },
    queryKey: ["selectBoard", id] as const,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  }));
};

export const invalidateSelectBoardQuery = (
  boardId: string
): InvalidateQueryFilters => {
  const options = selectBoardQueryOptions({ id: boardId })();
  return { queryKey: options.queryKey };
};

type SelectBoardsQueryOptionsArgs = {
  limit?: number;
  offset: number;
};

export const selectBoardsQueryOptions = ({
  limit = SELECT_BOARDS_DEFAULT_LIMIT,
  offset
}: SelectBoardsQueryOptionsArgs) => {
  const supabase = useSupabase();

  const session = useSessionContext();

  return queryOptions(() => ({
    queryFn: async () => {
      const query = supabase()
        .from("rooms")
        .select("id,name,media,owner_id,created_at");

      const userId = session()?.user.id;
      const withUser = userId ? query.eq("owner_id", userId) : query;

      const result = await withUser.range(offset, offset + limit);

      if (result.error) {
        throw result.error;
      }

      return result.data;
    },
    queryKey: ["selectBoards", { limit, offset }] as const
  }));
};

export const invalidateSelectBoardsQueries = (): InvalidateQueryFilters => {
  const options = selectBoardsQueryOptions({ limit: 0, offset: 0 })();
  return { queryKey: options.queryKey.slice(0, 1) };
};

type SelectPuzzleQueryOptionsArgs = {
  roomId: string;
};

export const selectPuzzleQueryOptions = ({
  roomId
}: SelectPuzzleQueryOptionsArgs) => {
  const supabase = useSupabase();

  return queryOptions(() => ({
    queryFn: async () => {
      const result = await supabase()
        .from("puzzle")
        .select()
        .eq("room_id", roomId);

      if (result.error) {
        throw result.error;
      }

      return result.data;
    },
    queryKey: ["selectPuzzle", roomId] as const,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  }));
};

export const invalidateSelectPuzzleQuery = (
  roomId: string
): InvalidateQueryFilters => {
  const options = selectPuzzleQueryOptions({ roomId })();
  return { queryKey: options.queryKey };
};

type UpdatePuzzleArgs = {
  id: string;
  isLocked: boolean;
  rotation: number;
  x: number;
  y: number;
};

export const useUpdateFragment = () => {
  const supabase = useSupabase();

  return async ({ id, isLocked, rotation, x, y }: UpdatePuzzleArgs) => {
    const result = await supabase()
      .from("puzzle")
      .update({ is_locked: isLocked, rotation, x, y })
      .eq("id", id);

    if (result.error) {
      throw result.error;
    }

    return result.data;
  };
};

export const insertBoardAction = action(
  insertBoardServerAction,
  "insertBoardAction"
);

export const updateBoardAction = action(
  updateBoardServerAction,
  "updateBoardAction"
);

export const deleteBoardAction = action(
  deleteBoardServerAction,
  "deleteBoardAction"
);

export const getInsertBoardArgsLoader = cache(
  getInsertBoardArgsServerLoader,
  INSERT_BOARD_ARGS_CACHE_KEY
);

export const setBoardAccessAction = action(
  setBoardAccessServerAction,
  "setBoardAccessAction"
);

export const getBoardAccessLoader = cache(
  getBoardAccessServerLoader,
  BOARDS_ACCESS_CACHE_KEY
);

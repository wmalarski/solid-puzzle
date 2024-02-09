import { action, cache } from "@solidjs/router";
import {
  type InvalidateQueryFilters,
  isServer,
  queryOptions
} from "@tanstack/solid-query";

import { useSessionContext } from "~/contexts/SessionContext";
import { useSupabase } from "~/contexts/SupabaseContext";
import { INSERT_BOARD_ARGS_CACHE_KEY } from "~/server/board/const";
import {
  deleteBoardServerAction,
  getInsertBoardArgsServerLoader,
  insertBoardServerAction,
  reloadBoardServerAction,
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
      const [board, fragments] = await Promise.all([
        supabase().from("rooms").select().eq("id", id).single(),
        supabase().from("puzzle").select().eq("room_id", id)
      ]);

      if (board.error) {
        throw board.error;
      }

      if (fragments.error) {
        throw fragments.error;
      }

      return { board: board.data, fragments: fragments.data };
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
    enabled: !isServer,
    queryFn: async () => {
      const query = supabase()
        .from("rooms")
        .select("id,name,media,owner_id,created_at,width,height,columns,rows");

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

type UpdateFragmentArgs = {
  fragmentId: string;
  isLocked: boolean;
  rotation: number;
  x: number;
  y: number;
};

export const useUpdateFragment = () => {
  const supabase = useSupabase();

  return async ({
    fragmentId,
    isLocked,
    rotation,
    x,
    y
  }: UpdateFragmentArgs) => {
    const result = await supabase()
      .from("puzzle")
      .update({ is_locked: isLocked, rotation, x, y })
      .eq("id", fragmentId);

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

export const reloadBoardAction = action(
  reloadBoardServerAction,
  "reloadBoardAction"
);

export const deleteBoardAction = action(
  deleteBoardServerAction,
  "deleteBoardAction"
);

export const getInsertBoardArgsLoader = cache(
  getInsertBoardArgsServerLoader,
  INSERT_BOARD_ARGS_CACHE_KEY
);

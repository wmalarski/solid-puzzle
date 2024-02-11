import { action, cache } from "@solidjs/router";

import { useSessionContext } from "~/contexts/SessionContext";
import { useSupabase } from "~/contexts/SupabaseContext";
import {
  INSERT_BOARD_ARGS_CACHE_KEY,
  SELECT_BOARD_LOADER_CACHE_KEY,
  SELECT_BOARDS_LOADER_CACHE_KEY
} from "~/server/board/const";
import {
  deleteBoardServerAction,
  getInsertBoardArgsServerLoader,
  insertBoardServerAction,
  reloadBoardServerAction,
  updateBoardServerAction
} from "~/server/board/rpc";

export const SELECT_BOARDS_DEFAULT_LIMIT = 10;

export const selectBoardLoader = cache(async (boardId: string) => {
  const supabase = useSupabase();

  const [board, fragments] = await Promise.all([
    supabase().from("rooms").select().eq("id", boardId).single(),
    supabase().from("puzzle").select().eq("room_id", boardId)
  ]);

  if (board.error) {
    throw board.error;
  }

  if (fragments.error) {
    throw fragments.error;
  }

  return { board: board.data, fragments: fragments.data };
}, SELECT_BOARD_LOADER_CACHE_KEY);

export type SelectBoardLoaderReturn = Awaited<
  ReturnType<typeof selectBoardLoader>
>;

type SelectBoardsQueryOptionsArgs = {
  limit?: number;
  offset: number;
};

export const selectBoardsLoader = cache(
  async ({
    limit = SELECT_BOARDS_DEFAULT_LIMIT,
    offset
  }: SelectBoardsQueryOptionsArgs) => {
    const supabase = useSupabase();

    const session = useSessionContext();

    const userId = session()?.user.id;

    if (!userId) {
      throw { message: "Unauthorized" };
    }

    const result = await supabase()
      .from("rooms")
      .select("id,name,media,owner_id,created_at,width,height,columns,rows")
      .eq("owner_id", userId)
      .range(offset, offset + limit);

    if (result.error) {
      throw result.error;
    }

    return result.data;
  },
  SELECT_BOARDS_LOADER_CACHE_KEY
);

export type SelectBoardsLoaderReturn = Awaited<
  ReturnType<typeof selectBoardsLoader>
>;

type UpdateFragmentArgs = {
  fragmentId: string;
  isLocked: boolean;
  rotation: number;
  x: number;
  y: number;
};

export const useUpdateFragment = () => {
  const supabase = useSupabase();

  return ({ fragmentId, isLocked, rotation, x, y }: UpdateFragmentArgs) => {
    return supabase()
      .from("puzzle")
      .update({ is_locked: isLocked, rotation, x, y })
      .eq("id", fragmentId);
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

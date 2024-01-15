import {
  type InvalidateQueryFilters,
  queryOptions,
} from "@tanstack/solid-query";

import { useSupabase } from "~/contexts/SupabaseContext";

export const SELECT_BOARDS_DEFAULT_LIMIT = 10;

type SelectBoardQueryOptionsArgs = {
  id: string;
};

export const selectBoardQueryOptions = ({
  id,
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
    refetchOnWindowFocus: false,
  }));
};

export const invalidateSelectBoardQuery = (
  boardId: string,
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
  offset,
}: SelectBoardsQueryOptionsArgs) => {
  const supabase = useSupabase();

  return queryOptions(() => ({
    queryFn: async () => {
      const result = await supabase()
        .from("rooms")
        .select("id,name,media,owner_id,created_at")
        .range(offset, offset + limit);

      if (result.error) {
        throw result.error;
      }

      return result.data;
    },
    queryKey: ["selectBoards", { limit, offset }] as const,
  }));
};

export const invalidateSelectBoardsQueries = (): InvalidateQueryFilters => {
  const options = selectBoardsQueryOptions({ limit: 0, offset: 0 })();
  return { queryKey: options.queryKey.slice(0, 1) };
};

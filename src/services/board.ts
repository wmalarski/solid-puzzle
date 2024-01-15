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
    queryFn: () => {
      return supabase().from("rooms").select().eq("id", id).single();
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
  limit: number;
  offset: number;
};

export const selectBoardsQueryOptions = (
  args: SelectBoardsQueryOptionsArgs,
) => {
  const supabase = useSupabase();

  return queryOptions(() => ({
    queryFn: () => {
      return supabase()
        .from("rooms")
        .select("id,name,media,owner_id,created_at")
        .range(args.offset, args.offset + args.limit);
    },
    queryKey: ["selectBoards", args] as const,
  }));
};

export const invalidateSelectBoardsQueries = (): InvalidateQueryFilters => {
  const options = selectBoardsQueryOptions({ limit: 0, offset: 0 })();
  return { queryKey: options.queryKey.slice(0, 1) };
};

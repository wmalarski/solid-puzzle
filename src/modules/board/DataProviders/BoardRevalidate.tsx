import { revalidate, useNavigate } from "@solidjs/router";
import {
  REALTIME_LISTEN_TYPES,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT
} from "@supabase/supabase-js";
import { type Component, onCleanup, onMount } from "solid-js";

import {
  SELECT_BOARD_LOADER_CACHE_KEY,
  SELECT_BOARDS_LOADER_CACHE_KEY
} from "~/server/board/const";
import { paths } from "~/utils/paths";
import { getClientSupabase } from "~/utils/supabase";

const BOARD_REMOVE_CHANNEL_NAME = "rooms:remove_board";
const BOARD_UPDATE_CHANNEL_NAME = "rooms:update_board";

type BoardRevalidateProviderProps = {
  boardId: string;
};

export const BoardRevalidateProvider: Component<
  BoardRevalidateProviderProps
> = (props) => {
  const navigate = useNavigate();

  onMount(() => {
    const supabase = getClientSupabase();

    const updateChannel = supabase
      .channel(BOARD_UPDATE_CHANNEL_NAME)
      .on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
        {
          event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE,
          filter: `id=eq.${props.boardId}`,
          schema: "public",
          table: "rooms"
        },
        async (payload) => {
          console.log("Update change received!", payload);
          await revalidate(SELECT_BOARD_LOADER_CACHE_KEY);
        }
      )
      .subscribe();

    const deleteChannel = supabase
      .channel(BOARD_REMOVE_CHANNEL_NAME)
      .on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
        {
          event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE,
          filter: `id=eq.${props.boardId}`,
          schema: "public",
          table: "rooms"
        },
        async (payload) => {
          console.log("Delete change received!", payload);
          await revalidate(SELECT_BOARDS_LOADER_CACHE_KEY);
          navigate(paths.boards());
        }
      )
      .subscribe();

    onCleanup(() => {
      supabase.removeChannel(updateChannel);
      supabase.removeChannel(deleteChannel);
    });
  });

  return null;
};

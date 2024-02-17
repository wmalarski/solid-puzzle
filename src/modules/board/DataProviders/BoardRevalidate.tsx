import { revalidate, useNavigate } from "@solidjs/router";
import { REALTIME_LISTEN_TYPES } from "@supabase/supabase-js";
import { type Component, type JSX, onCleanup, onMount } from "solid-js";

import { SELECT_BOARD_LOADER_CACHE_KEY } from "~/server/board/const";
import { paths } from "~/utils/paths";
import { getClientSupabase } from "~/utils/supabase";

const BOARD_CHANNEL_NAME = "rooms:board";
const BOARD_EVENT_NAME = "rooms:board";

type SendBoardRevalidateEventArgs = {
  boardId: string;
  removed: boolean;
};

export const sendBoardRevalidateEvent = ({
  boardId,
  removed
}: SendBoardRevalidateEventArgs) => {
  const supabase = getClientSupabase();
  const channelName = `${BOARD_CHANNEL_NAME}:${boardId}`;
  const channel = supabase.channel(channelName);

  channel.subscribe(async (type) => {
    if (type === "SUBSCRIBED") {
      await channel.send({
        event: BOARD_EVENT_NAME,
        removed,
        type: REALTIME_LISTEN_TYPES.BROADCAST
      });
      channel.unsubscribe();
    }
  });
};

type BoardRevalidateProviderProps = {
  boardId: string;
  children: JSX.Element;
};

export const BoardRevalidateProvider: Component<
  BoardRevalidateProviderProps
> = (props) => {
  const navigate = useNavigate();

  onMount(() => {
    const supabase = getClientSupabase();
    const channelName = `${BOARD_CHANNEL_NAME}:${props.boardId}`;
    const channel = supabase.channel(channelName);

    channel.on(
      REALTIME_LISTEN_TYPES.BROADCAST,
      { event: BOARD_EVENT_NAME },
      async (payload) => {
        if (payload.removed) {
          navigate(paths.boards());
        }
        await revalidate(SELECT_BOARD_LOADER_CACHE_KEY);
      }
    );

    onCleanup(() => {
      supabase.removeChannel(channel);
    });
  });

  return null;
};

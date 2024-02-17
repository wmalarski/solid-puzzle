import { throttle } from "@solid-primitives/scheduled";
import { revalidate, useNavigate } from "@solidjs/router";
import {
  REALTIME_LISTEN_TYPES,
  REALTIME_SUBSCRIBE_STATES
} from "@supabase/supabase-js";
import {
  type Component,
  type JSX,
  createContext,
  createSignal,
  onCleanup,
  onMount,
  useContext
} from "solid-js";

import { SELECT_BOARD_LOADER_CACHE_KEY } from "~/server/board/const";
import { paths } from "~/utils/paths";
import { getClientSupabase } from "~/utils/supabase";

import { REALTIME_THROTTLE_TIME } from "./const";

const BOARD_CHANNEL_NAME = "rooms:board";
const BOARD_EVENT_NAME = "rooms:board";

const createBoardState = (boardId: () => string) => {
  const navigate = useNavigate();

  const [sender, setSender] = createSignal<(removed: boolean) => void>(
    () => void 0
  );

  const supabase = getClientSupabase();

  onMount(() => {
    const channelName = `${BOARD_CHANNEL_NAME}:${boardId()}`;
    const channel = supabase.channel(channelName);

    channel
      .on(
        REALTIME_LISTEN_TYPES.BROADCAST,
        { event: BOARD_EVENT_NAME },
        async (payload) => {
          if (payload.removed) {
            navigate(paths.boards());
          }
          await revalidate(SELECT_BOARD_LOADER_CACHE_KEY);
        }
      )
      .subscribe((status) => {
        if (status !== REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          return;
        }

        setSender(() =>
          throttle((removed) => {
            channel.send({
              event: BOARD_EVENT_NAME,
              removed,
              type: REALTIME_LISTEN_TYPES.BROADCAST
            });
          }, REALTIME_THROTTLE_TIME)
        );
      });

    onCleanup(() => {
      supabase.removeChannel(channel);
    });
  });

  const sendRevalidate = (removed: boolean) => {
    sender()(removed);
  };

  return { sendRevalidate };
};

type SendBoardRevalidateEventArgs = {
  boardId: string;
  removed: boolean;
};

export const sendBoardRevalidateEvent = async ({
  boardId,
  removed
}: SendBoardRevalidateEventArgs) => {
  const supabase = getClientSupabase();
  const channelName = `${BOARD_CHANNEL_NAME}:${boardId}`;
  const channel = supabase.channel(channelName);

  await channel.send({
    event: BOARD_EVENT_NAME,
    removed,
    type: REALTIME_LISTEN_TYPES.BROADCAST
  });
};

type BoardRevalidateContextState = ReturnType<typeof createBoardState>;

const BoardRevalidateContext = createContext<BoardRevalidateContextState>({
  sendRevalidate: () => ({})
});

type BoardRevalidateProviderProps = {
  boardId: string;
  children: JSX.Element;
};

export const BoardRevalidateProvider: Component<
  BoardRevalidateProviderProps
> = (props) => {
  const value = createBoardState(() => props.boardId);

  return (
    <BoardRevalidateContext.Provider value={value}>
      {props.children}
    </BoardRevalidateContext.Provider>
  );
};

export const useBoardRevalidate = () => {
  return useContext(BoardRevalidateContext);
};

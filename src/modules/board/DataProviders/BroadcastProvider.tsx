import {
  REALTIME_SUBSCRIBE_STATES,
  RealtimeChannel
} from "@supabase/supabase-js";
import {
  Accessor,
  Component,
  createContext,
  createEffect,
  createMemo,
  onCleanup,
  ParentProps,
  useContext
} from "solid-js";

import { getClientSupabase } from "~/utils/supabase";

const CHANNEL_NAME = "rooms:broadcast";

type BroadcastProviderProps = ParentProps<{
  boardId: string;
}>;

const BroadcastProviderContext = createContext<Accessor<RealtimeChannel>>(
  () => {
    throw new Error("BroadcastProviderContext not defined");
  }
);

export const BroadcastProvider: Component<BroadcastProviderProps> = (props) => {
  const broadcastChannel = createMemo(() => {
    const supabase = getClientSupabase();
    const channelName = `${CHANNEL_NAME}:${props.boardId}`;
    const channel = supabase.channel(channelName);

    onCleanup(() => {
      supabase.removeChannel(channel);
    });

    return channel;
  });

  createEffect(() => {
    const channel = broadcastChannel();

    channel.subscribe((status) => {
      if (status !== REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
        return;
      }
    });
  });

  return (
    <BroadcastProviderContext.Provider value={broadcastChannel}>
      {props.children}
    </BroadcastProviderContext.Provider>
  );
};

export const useBroadcastChannel = () => {
  return useContext(BroadcastProviderContext);
};

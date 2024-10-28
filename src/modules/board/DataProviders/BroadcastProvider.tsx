import { RealtimeChannel } from "@supabase/supabase-js";
import {
  Accessor,
  Component,
  createContext,
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

export const createBroadcastChannel = (boardId: string) => {
  const supabase = getClientSupabase();
  const channelName = `${CHANNEL_NAME}:${boardId}`;
  const channel = supabase.channel(channelName);

  channel.subscribe();

  onCleanup(() => {
    supabase.removeChannel(channel);
  });

  return channel;
};

export const BroadcastProvider: Component<BroadcastProviderProps> = (props) => {
  const broadcastChannel = createMemo(() =>
    createBroadcastChannel(props.boardId)
  );

  return (
    <BroadcastProviderContext.Provider value={broadcastChannel}>
      {props.children}
    </BroadcastProviderContext.Provider>
  );
};

export const useBroadcastChannel = () => {
  return useContext(BroadcastProviderContext);
};

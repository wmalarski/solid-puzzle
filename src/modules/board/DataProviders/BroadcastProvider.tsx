import { throttle } from "@solid-primitives/scheduled";
import {
  REALTIME_LISTEN_TYPES,
  REALTIME_SUBSCRIBE_STATES,
  RealtimeChannel
} from "@supabase/supabase-js";
import {
  Accessor,
  createContext,
  createEffect,
  createMemo,
  onCleanup,
  ParentProps,
  useContext
} from "solid-js";

import { getClientSupabase } from "~/utils/supabase";

import { useBoardRevalidate } from "./BoardRevalidate";
import { REALTIME_THROTTLE_TIME } from "./const";
import { type PlayerCursorPayload, usePlayerCursors } from "./CursorProvider";
import { type FragmentState, usePuzzleStore } from "./PuzzleProvider";

const CHANNEL_NAME = "rooms:broadcast";
const PUZZLE_EVENT_NAME = "rooms:puzzle";
const CURSOR_EVENT_NAME = "rooms:cursor";
const REVALIDATE_EVENT_NAME = "rooms:revalidate";

type BroadcastProviderProps = ParentProps<{
  boardId: string;
}>;

type BroadcastProviderContextState = Accessor<RealtimeChannel>;

const BroadcastProviderContext = createContext<BroadcastProviderContextState>(
  () => {
    throw new Error("BroadcastProviderContext not defined");
  }
);

export function BroadcastProvider(props: BroadcastProviderProps) {
  const puzzle = usePuzzleStore();
  const cursors = usePlayerCursors();
  const revalidate = useBoardRevalidate();

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

    channel
      .on<FragmentState>(
        REALTIME_LISTEN_TYPES.BROADCAST,
        { event: PUZZLE_EVENT_NAME },
        ({ payload }) => puzzle.setRemoteFragment(payload)
      )
      .on<PlayerCursorPayload>(
        REALTIME_LISTEN_TYPES.BROADCAST,
        { event: CURSOR_EVENT_NAME },
        ({ payload }) => cursors.setRemoteCursor(payload)
      )
      .on(
        REALTIME_LISTEN_TYPES.BROADCAST,
        { event: REVALIDATE_EVENT_NAME },
        () => revalidate.setRemoteRevalidate()
      )
      .subscribe((status) => {
        if (status !== REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          return;
        }

        puzzle.setRemoteSender(
          throttle((payload) => {
            channel.send({
              event: PUZZLE_EVENT_NAME,
              payload,
              type: REALTIME_LISTEN_TYPES.BROADCAST
            });
          }, REALTIME_THROTTLE_TIME)
        );
        cursors.setRemoteSender(
          throttle((payload) => {
            channel.send({
              event: CURSOR_EVENT_NAME,
              payload,
              type: REALTIME_LISTEN_TYPES.BROADCAST
            });
          }, REALTIME_THROTTLE_TIME)
        );
        revalidate.setRemoteSender(
          throttle(() => {
            channel.send({
              event: REVALIDATE_EVENT_NAME,
              type: REALTIME_LISTEN_TYPES.BROADCAST
            });
          }, REALTIME_THROTTLE_TIME)
        );
      });
  });

  return (
    <BroadcastProviderContext.Provider value={broadcastChannel}>
      {props.children}
    </BroadcastProviderContext.Provider>
  );
}

export function useBroadcastChannel() {
  return useContext(BroadcastProviderContext);
}

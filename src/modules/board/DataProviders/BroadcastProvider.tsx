import { throttle } from "@solid-primitives/scheduled";
import {
  REALTIME_LISTEN_TYPES,
  REALTIME_SUBSCRIBE_STATES
} from "@supabase/supabase-js";
import { type Component, onCleanup, onMount } from "solid-js";

import { getClientSupabase } from "~/utils/supabase";

import { useBoardRevalidate } from "./BoardRevalidate";
import { type PlayerCursorPayload, usePlayerCursors } from "./CursorProvider";
import { type FragmentState, usePuzzleStore } from "./PuzzleProvider";
import { type SelectionPayload, usePlayerSelection } from "./SelectionProvider";
import { REALTIME_THROTTLE_TIME } from "./const";

const CHANNEL_NAME = "rooms:broadcast";
const SELECTION_EVENT_NAME = "rooms:selection";
const PUZZLE_EVENT_NAME = "rooms:puzzle";
const CURSOR_EVENT_NAME = "rooms:cursor";
const REVALIDATE_EVENT_NAME = "rooms:revalidate";

type BroadcastProviderProps = {
  boardId: string;
};

export const BroadcastProvider: Component<BroadcastProviderProps> = (props) => {
  const selection = usePlayerSelection();
  const puzzle = usePuzzleStore();
  const cursors = usePlayerCursors();
  const revalidate = useBoardRevalidate();

  onMount(() => {
    const supabase = getClientSupabase();
    const channelName = `${CHANNEL_NAME}:${props.boardId}`;
    const channel = supabase.channel(channelName);

    channel
      .on<SelectionPayload>(
        REALTIME_LISTEN_TYPES.BROADCAST,
        { event: SELECTION_EVENT_NAME },
        ({ payload }) => selection.setRemoteSelection(payload)
      )
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

        selection.setRemoteSender(
          throttle((payload) => {
            channel.send({
              event: SELECTION_EVENT_NAME,
              payload,
              type: REALTIME_LISTEN_TYPES.BROADCAST
            });
          }, REALTIME_THROTTLE_TIME)
        );
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

    onCleanup(() => {
      supabase.removeChannel(channel);
    });
  });

  return null;
};

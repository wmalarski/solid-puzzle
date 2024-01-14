import {
  REALTIME_LISTEN_TYPES,
  REALTIME_PRESENCE_LISTEN_EVENTS,
  REALTIME_SUBSCRIBE_STATES,
} from "@supabase/supabase-js";
import { type Component, createEffect, createMemo, onCleanup } from "solid-js";

import type { BoardAccess } from "~/server/share/db";

import { useSupabase } from "~/contexts/SupabaseContext";

import { usePlayerPresence } from "./PresenceProvider";

type Props = {
  boardAccess: BoardAccess;
};

const CHANNEL_NAME = "rooms";

export const RealtimeProvider: Component<Props> = (props) => {
  const supabase = useSupabase();

  const presence = usePlayerPresence();

  const channel = createMemo(() => {
    const boardId = props.boardAccess.boardId;

    return supabase().channel(CHANNEL_NAME, {
      config: { presence: { key: boardId } },
    });
  });

  const currentPlayerId = createMemo(() => {
    return presence.currentPlayer().playerId;
  });

  const currentPlayerName = createMemo(() => {
    return presence.currentPlayer().name;
  });

  const currentPlayerCursorColor = createMemo(() => {
    return presence.currentPlayer().cursorColor;
  });

  createEffect(() => {
    const playerId = currentPlayerId();
    const name = currentPlayerName();
    const cursorColor = currentPlayerCursorColor();

    const boardId = props.boardAccess.boardId;

    const channel = supabase().channel(CHANNEL_NAME, {
      config: { presence: { key: boardId } },
    });

    const subscription = channel
      .on(
        REALTIME_LISTEN_TYPES.PRESENCE,
        { event: REALTIME_PRESENCE_LISTEN_EVENTS.SYNC },
        () => {
          const newState = channel.presenceState();
          console.log("sync", newState);
        },
      )
      .on(
        REALTIME_LISTEN_TYPES.PRESENCE,
        { event: REALTIME_PRESENCE_LISTEN_EVENTS.JOIN },
        ({ newPresences }) => {
          presence.joinRemote(
            newPresences.map((entry) => ({
              cursorColor: entry.cursorColor,
              name: entry.name,
              playerId: entry.playerId,
              x: 0,
              y: 0,
            })),
          );
        },
      )
      .on(
        REALTIME_LISTEN_TYPES.PRESENCE,
        { event: REALTIME_PRESENCE_LISTEN_EVENTS.LEAVE },
        ({ leftPresences }) => {
          presence.leave({
            playerIds: leftPresences.map((entry) => entry.playerId),
          });
        },
      )
      .on(
        REALTIME_LISTEN_TYPES.BROADCAST,
        { event: "cursor-pos" },
        (payload) => {
          console.log("payload", payload);
        },
      )
      .subscribe(async (status, err) => {
        if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          await channel.track({
            cursorColor,
            name,
            playerId,
            x: 0,
            y: 0,
          });
        }
        // eslint-disable-next-line no-console
        console.error(status, err);
      });

    onCleanup(() => {
      subscription.unsubscribe();

      const untrackPresence = async () => {
        await channel.untrack();
      };

      untrackPresence();

      supabase().removeChannel(channel);
    });
  });

  createEffect(() => {
    const player = presence.currentPlayer();

    const realtimeChannel = channel();

    const subscription = channel()
      .send(
        REALTIME_LISTEN_TYPES.PRESENCE,
        { event: REALTIME_PRESENCE_LISTEN_EVENTS.SYNC },
        () => {
          const newState = realtimeChannel.presenceState();
          console.log("sync", newState);
        },
      )
      .on(
        REALTIME_LISTEN_TYPES.PRESENCE,
        { event: REALTIME_PRESENCE_LISTEN_EVENTS.JOIN },
        ({ newPresences }) => {
          presence.joinRemote(
            newPresences.map((entry) => ({
              cursorColor: entry.cursorColor,
              name: entry.name,
              playerId: entry.playerId,
              x: 0,
              y: 0,
            })),
          );
        },
      )
      .on(
        REALTIME_LISTEN_TYPES.PRESENCE,
        { event: REALTIME_PRESENCE_LISTEN_EVENTS.LEAVE },
        ({ leftPresences }) => {
          presence.leave({
            playerIds: leftPresences.map((entry) => entry.playerId),
          });
        },
      )
      .on(
        REALTIME_LISTEN_TYPES.BROADCAST,
        { event: "cursor-pos" },
        (payload) => {
          console.log("payload", payload);
        },
      )
      .subscribe(async (status, err) => {
        if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          await realtimeChannel.track({
            cursorColor,
            name,
            playerId,
            x: 0,
            y: 0,
          });
        }
        // eslint-disable-next-line no-console
        console.error(status, err);
      });

    onCleanup(() => {
      subscription.unsubscribe();

      const untrackPresence = async () => {
        await realtimeChannel.untrack();
      };

      untrackPresence();
    });
  });

  return null;
};

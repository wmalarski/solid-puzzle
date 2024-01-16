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
import { createStore, produce } from "solid-js/store";

import type { BoardAccess } from "~/types/models";

import { useSupabase } from "~/contexts/SupabaseContext";

import { usePlayerPresence } from "./PresenceProvider";

export type PlayerCursorState = {
  x: number;
  y: number;
};

type PlayersCursorState = Record<string, PlayerCursorState | undefined>;

const CURSOR_CHANNEL_NAME = "rooms:cursors";
const CURSOR_EVENT_NAME = "rooms:cursor";

const createPlayerCursorState = (boardAccess: () => BoardAccess) => {
  const presence = usePlayerPresence();

  const [cursors, setCursors] = createStore<PlayersCursorState>({});

  const [sender, setSender] = createSignal(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_args: PlayerCursorState) => void 0
  );

  const supabase = useSupabase();

  onMount(() => {
    const channelName = `${CURSOR_CHANNEL_NAME}:${boardAccess().boardId}`;
    const channel = supabase().channel(channelName);
    const playerId = presence.currentPlayer().playerId;

    channel
      .on(
        REALTIME_LISTEN_TYPES.BROADCAST,
        { event: CURSOR_EVENT_NAME },
        (payload) => {
          setCursors(
            produce((state) => {
              const player = state[payload.playerId];
              if (player) {
                player.x = payload.x;
                player.y = payload.y;
                return;
              }
              state[payload.playerId] = {
                x: payload.x,
                y: payload.y
              };
            })
          );
        }
      )
      .subscribe((status) => {
        if (status !== REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          return;
        }

        setSender(() => (update) => {
          channel.send({
            event: CURSOR_EVENT_NAME,
            playerId,
            type: REALTIME_LISTEN_TYPES.BROADCAST,
            ...update
          });
        });
      });

    onCleanup(() => {
      supabase().removeChannel(channel);
    });
  });

  const send = (args: PlayerCursorState) => {
    sender()(args);
  };

  const leave = (playerIds: string[]) => {
    setCursors(
      produce((state) => {
        playerIds.forEach((playerId) => {
          state[playerId] = undefined;
        });
      })
    );
  };

  return { cursors, leave, send };
};

type PlayerCursorContextState = ReturnType<typeof createPlayerCursorState>;

const PlayerCursorContext = createContext<PlayerCursorContextState>({
  cursors: {},
  leave: () => void 0,
  send: () => void 0
});

type PlayerCursorProviderProps = {
  boardAccess: BoardAccess;
  children: JSX.Element;
};

export const PlayerCursorProvider: Component<PlayerCursorProviderProps> = (
  props
) => {
  const value = createPlayerCursorState(() => props.boardAccess);

  return (
    <PlayerCursorContext.Provider value={value}>
      {props.children}
    </PlayerCursorContext.Provider>
  );
};

export const usePlayerCursors = () => {
  return useContext(PlayerCursorContext);
};

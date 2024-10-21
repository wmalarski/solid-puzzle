import { throttle } from "@solid-primitives/scheduled";
import { REALTIME_LISTEN_TYPES } from "@supabase/supabase-js";
import { createContext, createMemo, ParentProps, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";

import { useBroadcastChannel } from "./BroadcastProvider";
import { REALTIME_THROTTLE_TIME } from "./const";

const CURSOR_EVENT_NAME = "rooms:cursor";

type PlayerCursorState = {
  x: number;
  y: number;
};

type PlayerCursorPayload = {
  playerId: string;
} & PlayerCursorState;

type PlayersCursorState = Record<string, PlayerCursorState | undefined>;

const createPlayerCursorState = (args: () => PlayerCursorProviderProps) => {
  const broadcastChannel = useBroadcastChannel();

  const [cursors, setCursors] = createStore<PlayersCursorState>({});

  const throttledSend = throttle((payload: PlayerCursorPayload) => {
    broadcastChannel().send({
      event: CURSOR_EVENT_NAME,
      payload,
      type: REALTIME_LISTEN_TYPES.BROADCAST
    });
  }, REALTIME_THROTTLE_TIME);

  const send = (state: PlayerCursorState) => {
    throttledSend({ ...state, playerId: args().playerId });
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

  const setRemoteCursor = (payload: PlayerCursorPayload) => {
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
  };

  return { cursors, leave, send, setRemoteCursor };
};

type PlayerCursorContextState = () => ReturnType<
  typeof createPlayerCursorState
>;

const PlayerCursorContext = createContext<PlayerCursorContextState>(() => {
  throw new Error("PlayerCursorContext not defined");
});

type PlayerCursorProviderProps = ParentProps<{
  playerId: string;
}>;

export function PlayerCursorProvider(props: PlayerCursorProviderProps) {
  const value = createMemo(() => createPlayerCursorState(() => props));

  return (
    <PlayerCursorContext.Provider value={value}>
      {props.children}
    </PlayerCursorContext.Provider>
  );
}

export const usePlayerCursors = () => {
  return useContext(PlayerCursorContext);
};

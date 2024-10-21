import { throttle } from "@solid-primitives/scheduled";
import { REALTIME_LISTEN_TYPES } from "@supabase/supabase-js";
import {
  Accessor,
  Component,
  createContext,
  createMemo,
  ParentProps,
  useContext
} from "solid-js";
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

const createPlayerCursorState = (playerId: string) => {
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
    throttledSend({ ...state, playerId });
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

const PlayerCursorContext = createContext<
  Accessor<ReturnType<typeof createPlayerCursorState>>
>(() => {
  throw new Error("PlayerCursorContext not defined");
});

type PlayerCursorProviderProps = ParentProps<{
  playerId: string;
}>;

export const PlayerCursorProvider: Component<PlayerCursorProviderProps> = (
  props
) => {
  const value = createMemo(() => createPlayerCursorState(props.playerId));

  return (
    <PlayerCursorContext.Provider value={value}>
      {props.children}
    </PlayerCursorContext.Provider>
  );
};

export const usePlayerCursors = () => {
  return useContext(PlayerCursorContext);
};

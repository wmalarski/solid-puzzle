import { createContext, createSignal, type JSX, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";

export type PlayerCursorState = {
  x: number;
  y: number;
};

export type PlayerCursorPayload = {
  playerId: string;
} & PlayerCursorState;

type PlayersCursorState = Record<string, PlayerCursorState | undefined>;

type PlayerCursorProviderProps = {
  children: JSX.Element;
  playerId: string;
};

const createPlayerCursorState = (args: () => PlayerCursorProviderProps) => {
  const [cursors, setCursors] = createStore<PlayersCursorState>({});

  const [sender, setSender] = createSignal<(args: PlayerCursorPayload) => void>(
    () => void 0
  );

  const send = (state: PlayerCursorState) => {
    sender()({ ...state, playerId: args().playerId });
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

  const setRemoteSender = (sender: (payload: PlayerCursorPayload) => void) => {
    setSender(() => sender);
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

  return { cursors, leave, send, setRemoteCursor, setRemoteSender };
};

type PlayerCursorContextState = ReturnType<typeof createPlayerCursorState>;

const PlayerCursorContext = createContext<PlayerCursorContextState>({
  cursors: {},
  leave: () => void 0,
  send: () => void 0,
  setRemoteCursor: () => void 0,
  setRemoteSender: () => void 0
});

export function PlayerCursorProvider(props: PlayerCursorProviderProps) {
  const value = createPlayerCursorState(() => props);

  return (
    <PlayerCursorContext.Provider value={value}>
      {props.children}
    </PlayerCursorContext.Provider>
  );
}

export const usePlayerCursors = () => {
  return useContext(PlayerCursorContext);
};

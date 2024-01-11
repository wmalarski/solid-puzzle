import {
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  useContext,
  type Component,
  type JSX,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import type { BoardAccess } from "~/server/share/db";

export type PlayerState = {
  name: string;
  selectedId: string | null;
  x: number;
  y: number;
};

type PlayersState = Record<string, PlayerState | undefined>;

type JoinArgs = {
  name: string;
  playerId: string;
  x: number;
  y: number;
};

type LeaveArgs = {
  playerId: string;
};

type SetCursorArgs = {
  playerId: string;
  x: number;
  y: number;
};

type SetSelectionArgs = {
  playerId: string;
  selectedId: string | null;
};

const createPlayerPresenceState = () => {
  const [currentPlayer, setCurrentPlayer] = createSignal<string>();
  const [players, setPlayers] = createStore<PlayersState>({});

  const join = ({ playerId, x, y, name }: JoinArgs) => {
    setCurrentPlayer(playerId);
    setPlayers(
      produce((state) => {
        state[playerId] = { name, selectedId: null, x, y };
      }),
    );
  };

  const leave = ({ playerId }: LeaveArgs) => {
    setPlayers(
      produce((state) => {
        state[playerId] = undefined;
      }),
    );
  };

  const setCursor = ({ playerId, x, y }: SetCursorArgs) => {
    setPlayers(
      produce((state) => {
        const currentPlayer = state[playerId];
        if (currentPlayer) {
          currentPlayer.x = x;
          currentPlayer.y = y;
        }
      }),
    );
  };

  const setSelection = ({ playerId, selectedId }: SetSelectionArgs) => {
    setPlayers(
      produce((state) => {
        const currentPlayer = state[playerId];
        if (currentPlayer) {
          currentPlayer.selectedId = selectedId;
        }
      }),
    );
  };

  const setPlayerSelection = (selectedId: string | null) => {
    const player = currentPlayer();
    if (player) {
      setPlayers(
        produce((state) => {
          const currentPlayer = state[player];
          if (currentPlayer) {
            currentPlayer.selectedId = selectedId;
          }
        }),
      );
    }
  };

  const playerSelection = () => {
    const player = currentPlayer();
    return player ? players[player]?.selectedId : null;
  };

  return {
    join,
    leave,
    playerSelection,
    players,
    setCursor,
    setPlayerSelection,
    setSelection,
  };
};

type PlayerPresenceState = ReturnType<typeof createPlayerPresenceState>;

const PlayerPresenceContext = createContext<PlayerPresenceState>({
  join: () => void 0,
  leave: () => void 0,
  playerSelection: () => null,
  players: {},
  setCursor: () => void 0,
  setPlayerSelection: () => void 0,
  setSelection: () => void 0,
});

type PlayerPresenceProviderProps = {
  boardAccess: BoardAccess;
  children: JSX.Element;
};

export const PlayerPresenceProvider: Component<PlayerPresenceProviderProps> = (
  props,
) => {
  const value = createPlayerPresenceState();

  createEffect(() => {
    value.join({
      name: props.boardAccess.username,
      playerId: props.boardAccess.username,
      x: 0,
      y: 0,
    });
    onCleanup(() => {
      value.leave({
        playerId: props.boardAccess.username,
      });
    });
  });

  return (
    <PlayerPresenceContext.Provider value={value}>
      {props.children}
    </PlayerPresenceContext.Provider>
  );
};

export const usePlayerPresence = () => {
  return useContext(PlayerPresenceContext);
};

import {
  type Component,
  type JSX,
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  useContext,
} from "solid-js";
import { createStore, produce } from "solid-js/store";

import type { BoardAccess } from "~/server/share/db";

import { randomHexColor } from "~/utils/colors";

export type PlayerState = {
  cursorColor: string;
  name: string;
  selectedId: null | string;
  x: number;
  y: number;
};

type PlayersState = Record<string, PlayerState | undefined>;

type JoinArgs = {
  cursorColor: string;
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
  selectedId: null | string;
};

const createPlayerPresenceState = () => {
  const [currentPlayer, setCurrentPlayer] = createSignal<string>();
  const [players, setPlayers] = createStore<PlayersState>({});

  const join = ({ cursorColor, name, playerId, x, y }: JoinArgs) => {
    setCurrentPlayer(playerId);
    setPlayers(
      produce((state) => {
        state[playerId] = { cursorColor, name, selectedId: null, x, y };
      }),
    );
  };

  const joinRemote = ({ cursorColor, name, playerId, x, y }: JoinArgs) => {
    setPlayers(
      produce((state) => {
        state[playerId] = { cursorColor, name, selectedId: null, x, y };
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

  const setPlayerSelection = (selectedId: null | string) => {
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
    currentPlayer,
    join,
    joinRemote,
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
  currentPlayer: () => "",
  join: () => void 0,
  joinRemote: () => void 0,
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
  const randomHex = randomHexColor();

  const value = createPlayerPresenceState();

  createEffect(() => {
    value.join({
      cursorColor: randomHex,
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

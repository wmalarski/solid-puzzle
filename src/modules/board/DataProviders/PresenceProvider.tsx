import { nanoid } from "nanoid";
import {
  type Component,
  type JSX,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  useContext,
} from "solid-js";
import { createStore, produce } from "solid-js/store";

import type { BoardAccess } from "~/server/share/db";

import { useSessionContext } from "~/contexts/SessionContext";
import { randomHexColor } from "~/utils/colors";

export type PlayerState = {
  cursorColor: string;
  name: string;
  playerId: string;
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
  playerIds: string[];
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

const cursorColor = randomHexColor();
const defaultPlayerId = nanoid();

const placeholderCurrentPlayer: PlayerState = {
  cursorColor,
  name: defaultPlayerId,
  playerId: defaultPlayerId,
  selectedId: null,
  x: 0,
  y: 0,
};

const createPlayerPresenceState = () => {
  const [currentPlayerId, setCurrentPlayerId] = createSignal<string>();
  const [players, setPlayers] = createStore<PlayersState>({});

  const join = ({ cursorColor, name, playerId, x, y }: JoinArgs) => {
    setCurrentPlayerId(playerId);
    setPlayers(
      produce((state) => {
        state[playerId] = {
          cursorColor,
          name,
          playerId,
          selectedId: null,
          x,
          y,
        };
      }),
    );
  };

  const joinRemote = (presences: JoinArgs[]) => {
    setPlayers(
      produce((state) => {
        presences.forEach(({ cursorColor, name, playerId, x, y }) => {
          state[playerId] = {
            cursorColor,
            name,
            playerId,
            selectedId: null,
            x,
            y,
          };
        });
      }),
    );
  };

  const leave = ({ playerIds }: LeaveArgs) => {
    setPlayers(
      produce((state) => {
        playerIds.forEach((playerId) => {
          state[playerId] = undefined;
        });
      }),
    );
  };

  const setCursor = ({ playerId, x, y }: SetCursorArgs) => {
    setPlayers(
      produce((state) => {
        const player = state[playerId];
        if (player) {
          player.x = x;
          player.y = y;
        }
      }),
    );
  };

  const setSelection = ({ playerId, selectedId }: SetSelectionArgs) => {
    setPlayers(
      produce((state) => {
        const player = state[playerId];
        if (player) {
          player.selectedId = selectedId;
        }
      }),
    );
  };

  const setPlayerSelection = (selectedId: null | string) => {
    const playerId = currentPlayerId();
    if (playerId) {
      setPlayers(
        produce((state) => {
          const player = state[playerId];
          if (player) {
            player.selectedId = selectedId;
          }
        }),
      );
    }
  };

  const currentPlayer = createMemo(() => {
    const playerId = currentPlayerId();
    return playerId
      ? players[playerId] || placeholderCurrentPlayer
      : placeholderCurrentPlayer;
  });

  return {
    currentPlayer,
    join,
    joinRemote,
    leave,
    players,
    setCursor,
    setPlayerSelection,
    setSelection,
  };
};

type PlayerPresenceState = ReturnType<typeof createPlayerPresenceState>;

const PlayerPresenceContext = createContext<PlayerPresenceState>({
  currentPlayer: () => placeholderCurrentPlayer,
  join: () => void 0,
  joinRemote: () => void 0,
  leave: () => void 0,
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

  const session = useSessionContext();

  createEffect(() => {
    const playerId = session()?.userId || defaultPlayerId;

    value.join({
      cursorColor,
      name: props.boardAccess.username,
      playerId,
      x: 0,
      y: 0,
    });

    onCleanup(() => {
      value.leave({ playerIds: [playerId] });
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

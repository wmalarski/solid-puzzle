import {
  createContext,
  createSignal,
  useContext,
  type Component,
  type JSX,
} from "solid-js";
import { createStore } from "solid-js/store";

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
    setPlayers(playerId, { name, selectedId: null, x, y });
  };

  const leave = ({ playerId }: LeaveArgs) => {
    setPlayers(playerId, undefined);
  };

  const setCursor = ({ playerId, x, y }: SetCursorArgs) => {
    setPlayers(playerId, "x", x);
    setPlayers(playerId, "y", y);
  };

  const setSelection = ({ playerId, selectedId }: SetSelectionArgs) => {
    setPlayers(playerId, "selectedId", selectedId);
  };

  const setPlayerSelection = (selectedId: string | null) => {
    const player = currentPlayer();
    if (player) {
      setPlayers(player, "selectedId", selectedId);
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
  children: JSX.Element;
};

export const PlayerPresenceProvider: Component<PlayerPresenceProviderProps> = (
  props,
) => {
  const value = createPlayerPresenceState();

  return (
    <PlayerPresenceContext.Provider value={value}>
      {props.children}
    </PlayerPresenceContext.Provider>
  );
};

export const usePlayerPresence = () => {
  return useContext(PlayerPresenceContext);
};

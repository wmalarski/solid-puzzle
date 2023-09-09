import { createContext, useContext, type Component, type JSX } from "solid-js";
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
  const [players, setPlayer] = createStore<PlayersState>({});

  const join = ({ playerId, x, y, name }: JoinArgs) => {
    setPlayer(playerId, { name, selectedId: null, x, y });
  };

  const leave = ({ playerId }: LeaveArgs) => {
    setPlayer(playerId, undefined);
  };

  const setCursor = ({ playerId, x, y }: SetCursorArgs) => {
    setPlayer(playerId, "x", x);
    setPlayer(playerId, "y", y);
  };

  const setSelection = ({ playerId, selectedId }: SetSelectionArgs) => {
    setPlayer(playerId, "selectedId", selectedId);
  };

  return { join, leave, players, setCursor, setSelection };
};

type PlayerPresenceState = ReturnType<typeof createPlayerPresenceState>;

const PlayerPresenceContext = createContext<PlayerPresenceState>({
  join: () => void 0,
  leave: () => void 0,
  players: {},
  setCursor: () => void 0,
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

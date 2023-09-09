import { createContext, useContext, type Component, type JSX } from "solid-js";
import { createStore } from "solid-js/store";

type PlayerState = {
  x: number;
  y: number;
};

type PlayersState = Record<string, PlayerState | undefined>;

type JoinArgs = {
  x: number;
  y: number;
  playerId: string;
};

type LeaveArgs = {
  playerId: string;
};

type SetCursorArgs = {
  x: number;
  y: number;
  playerId: string;
};

const createPlayerPresenceState = () => {
  const [players, setPlayer] = createStore<PlayersState>({});

  const join = ({ playerId, x, y }: JoinArgs) => {
    setPlayer(playerId, { x, y });
  };

  const leave = ({ playerId }: LeaveArgs) => {
    setPlayer(playerId, undefined);
  };

  const setCursor = ({ playerId, x, y }: SetCursorArgs) => {
    setPlayer(playerId, "x", x);
    setPlayer(playerId, "y", y);
  };

  return { join, leave, players, setCursor };
};

type PlayerPresenceState = ReturnType<typeof createPlayerPresenceState>;

const PlayerPresenceContext = createContext<PlayerPresenceState>({
  join: () => void 0,
  leave: () => void 0,
  players: {},
  setCursor: () => void 0,
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

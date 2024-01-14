import { nanoid } from "nanoid";
import {
  type Component,
  type JSX,
  createContext,
  createEffect,
  createSignal,
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
};

type PlayersState = Record<string, PlayerState | undefined>;

type JoinArgs = {
  cursorColor: string;
  name: string;
  playerId: string;
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
};

const createPlayerPresenceState = () => {
  const [currentPlayer, setCurrentPlayer] = createSignal<PlayerState>(
    placeholderCurrentPlayer,
  );

  const [players, setPlayers] = createStore<PlayersState>({});

  const join = ({ cursorColor, name, playerId }: JoinArgs) => {
    setCurrentPlayer({
      cursorColor,
      name,
      playerId,
      selectedId: null,
    });
  };

  const joinRemote = (presences: JoinArgs[]) => {
    setPlayers(
      produce((state) => {
        presences.forEach(({ cursorColor, name, playerId }) => {
          state[playerId] = { cursorColor, name, playerId, selectedId: null };
        });
      }),
    );
  };

  const leave = (playerIds: string[]) => {
    setPlayers(
      produce((state) => {
        playerIds.forEach((playerId) => {
          state[playerId] = undefined;
        });
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
    setCurrentPlayer((current) => ({ ...current, selectedId }));
  };

  return {
    currentPlayer,
    join,
    joinRemote,
    leave,
    players,
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
    value.join({
      cursorColor,
      name: props.boardAccess.username,
      playerId: session()?.userId || defaultPlayerId,
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

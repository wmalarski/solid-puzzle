import {
  REALTIME_LISTEN_TYPES,
  REALTIME_PRESENCE_LISTEN_EVENTS,
  REALTIME_SUBSCRIBE_STATES
} from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import {
  type Component,
  type JSX,
  createContext,
  createMemo,
  onCleanup,
  onMount,
  useContext
} from "solid-js";
import { createStore, produce } from "solid-js/store";

import type { BoardAccess } from "~/types/models";

import { useSessionContext } from "~/contexts/SessionContext";
import { useSupabase } from "~/contexts/SupabaseContext";
import { randomHexColor } from "~/utils/colors";

import { usePlayerCursors } from "./CursorProvider";
import { usePlayerSelection } from "./SelectionProvider";

export type PlayerState = {
  color: string;
  name: string;
  playerId: string;
};

type PlayersState = Record<string, PlayerState | undefined>;

const PRESENCE_CHANNEL_NAME = "rooms";

const defaultColor = randomHexColor();
const defaultPlayerId = nanoid();

const placeholderCurrentPlayer: PlayerState = {
  color: defaultColor,
  name: defaultPlayerId,
  playerId: defaultPlayerId
};

const createPlayerPresenceState = (boardAccess: () => BoardAccess) => {
  const [players, setPlayers] = createStore<PlayersState>({});

  const session = useSessionContext();
  const selection = usePlayerSelection();
  const cursors = usePlayerCursors();

  const currentPlayer = createMemo(() => {
    return {
      color: defaultColor,
      name: boardAccess().userName,
      playerId: session()?.user.id || defaultPlayerId
    };
  });

  const supabase = useSupabase();

  onMount(() => {
    const player = currentPlayer();

    const channel = supabase().channel(PRESENCE_CHANNEL_NAME, {
      config: { presence: { key: boardAccess().boardId } }
    });

    const subscription = channel
      .on(
        REALTIME_LISTEN_TYPES.PRESENCE,
        { event: REALTIME_PRESENCE_LISTEN_EVENTS.SYNC },
        () => {
          const newState = channel.presenceState();
          // eslint-disable-next-line no-console
          console.log("PRESENCE_sync", newState);
        }
      )
      .on(
        REALTIME_LISTEN_TYPES.PRESENCE,
        { event: REALTIME_PRESENCE_LISTEN_EVENTS.JOIN },
        ({ newPresences }) => {
          setPlayers(
            produce((state) => {
              newPresences.forEach((presence) => {
                state[presence.playerId] = {
                  color: presence.color,
                  name: presence.name,
                  playerId: presence.playerId
                };
              });
            })
          );
        }
      )
      .on(
        REALTIME_LISTEN_TYPES.PRESENCE,
        { event: REALTIME_PRESENCE_LISTEN_EVENTS.LEAVE },
        ({ leftPresences }) => {
          const leftIds = leftPresences.map((presence) => presence.playerId);

          selection.leave(leftIds);
          cursors.leave(leftIds);

          setPlayers(
            produce((state) => {
              leftIds.forEach((playerId) => {
                state[playerId] = undefined;
              });
            })
          );
        }
      )
      .subscribe(async (status) => {
        if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          // eslint-disable-next-line no-console
          await channel.track(player);
        }
      });

    onCleanup(() => {
      const untrackPresence = async () => {
        await subscription.unsubscribe();
        await channel.untrack();
        await supabase().removeChannel(channel);
      };

      untrackPresence();
    });
  });

  return { currentPlayer, players };
};

type PlayerPresenceState = ReturnType<typeof createPlayerPresenceState>;

const PlayerPresenceContext = createContext<PlayerPresenceState>({
  currentPlayer: () => placeholderCurrentPlayer,
  players: {}
});

type PlayerPresenceProviderProps = {
  boardAccess: BoardAccess;
  children: JSX.Element;
};

export const PlayerPresenceProvider: Component<PlayerPresenceProviderProps> = (
  props
) => {
  const value = createPlayerPresenceState(() => props.boardAccess);

  return (
    <PlayerPresenceContext.Provider value={value}>
      {props.children}
    </PlayerPresenceContext.Provider>
  );
};

export const usePlayerPresence = () => {
  return useContext(PlayerPresenceContext);
};

import {
  REALTIME_LISTEN_TYPES,
  REALTIME_PRESENCE_LISTEN_EVENTS,
  REALTIME_SUBSCRIBE_STATES
} from "@supabase/supabase-js";
import {
  createContext,
  createMemo,
  onCleanup,
  ParentProps,
  useContext
} from "solid-js";
import { createStore, produce } from "solid-js/store";

import type { BoardAccess } from "~/server/access/rpc";

import { getClientSupabase } from "~/utils/supabase";

import { usePlayerCursors } from "./CursorProvider";
import { usePlayerSelection } from "./SelectionProvider";

export type PlayerState = {
  color: string;
  name: string;
  playerId: string;
};

type PlayersState = Record<string, PlayerState | undefined>;

const PRESENCE_CHANNEL_NAME = "rooms";

const createPlayerPresenceState = (boardAccess: BoardAccess) => {
  const [players, setPlayers] = createStore<PlayersState>({});
  const selection = usePlayerSelection();
  const cursors = usePlayerCursors();

  const currentPlayer = {
    color: boardAccess.playerColor,
    name: boardAccess.userName,
    playerId: boardAccess.playerId
  };

  const supabase = getClientSupabase();
  const boardId = boardAccess.boardId;
  const channelName = `${PRESENCE_CHANNEL_NAME}:${boardId}`;

  const channel = supabase.channel(channelName, {
    config: { presence: { key: boardId } }
  });

  const subscription = channel
    .on(
      REALTIME_LISTEN_TYPES.PRESENCE,
      { event: REALTIME_PRESENCE_LISTEN_EVENTS.SYNC },
      () => {
        const newState = channel.presenceState<PlayerState>();

        setPlayers(
          produce((state) => {
            newState[boardId]?.forEach((presence) => {
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

        selection().leave(leftIds);
        cursors().leave(leftIds);

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
        await channel.track(currentPlayer);
      }
    });

  onCleanup(() => {
    const untrackPresence = async () => {
      await subscription.unsubscribe();
      await channel.untrack();
      await supabase.removeChannel(channel);
    };

    untrackPresence();
  });

  return { currentPlayer, players };
};

type PlayerPresenceState = () => ReturnType<typeof createPlayerPresenceState>;

const PlayerPresenceContext = createContext<PlayerPresenceState>(() => {
  throw new Error("PlayerPresenceContext not defined");
});

type PlayerPresenceProviderProps = ParentProps<{
  boardAccess: BoardAccess;
}>;

export function PlayerPresenceProvider(props: PlayerPresenceProviderProps) {
  const value = createMemo(() => createPlayerPresenceState(props.boardAccess));

  return (
    <PlayerPresenceContext.Provider value={value}>
      {props.children}
    </PlayerPresenceContext.Provider>
  );
}

export const usePlayerPresence = () => {
  return useContext(PlayerPresenceContext);
};

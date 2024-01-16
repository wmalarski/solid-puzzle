import { throttle } from "@solid-primitives/scheduled";
import {
  REALTIME_LISTEN_TYPES,
  REALTIME_SUBSCRIBE_STATES
} from "@supabase/supabase-js";
import {
  type Component,
  type JSX,
  createContext,
  createSignal,
  onCleanup,
  onMount,
  useContext
} from "solid-js";
import { createStore, produce } from "solid-js/store";

import type { BoardAccess } from "~/types/models";

import { useSupabase } from "~/contexts/SupabaseContext";

import { usePlayerPresence } from "./PresenceProvider";
import { REALTIME_THROTTLE_TIME } from "./const";

type PlayerSelectionState = Record<string, null | string | undefined>;

const SELECTION_CHANNEL_NAME = "rooms:selections";
const SELECTION_EVENT_NAME = "rooms:selection";

const createPlayerSelectionState = (boardAccess: () => BoardAccess) => {
  const presence = usePlayerPresence();

  const [selectedId, setSelectedId] = createSignal<null | string>(null);

  const [selection, setSelection] = createStore<PlayerSelectionState>({});

  const [sender, setSender] = createSignal<(arg: null | string) => void>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_selectionId: null | string) => void 0
  );

  const supabase = useSupabase();

  onMount(() => {
    const channelName = `${SELECTION_CHANNEL_NAME}:${boardAccess().boardId}`;
    const channel = supabase().channel(channelName);
    const playerId = presence.currentPlayer().playerId;

    channel
      .on(
        REALTIME_LISTEN_TYPES.BROADCAST,
        { event: SELECTION_EVENT_NAME },
        (payload) => {
          setSelection(
            produce((state) => {
              state[payload.playerId] = payload.selectionId;
            })
          );
        }
      )
      .subscribe((status) => {
        if (status !== REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          return;
        }

        setSender(() =>
          throttle((selectionId) => {
            channel.send({
              event: SELECTION_EVENT_NAME,
              playerId,
              selectionId,
              type: REALTIME_LISTEN_TYPES.BROADCAST
            });
          }, REALTIME_THROTTLE_TIME)
        );
      });

    onCleanup(() => {
      supabase().removeChannel(channel);
    });
  });

  const select = (selectionId: null | string) => {
    sender()(selectionId);
    setSelectedId(selectionId);
  };

  const leave = (playerIds: string[]) => {
    setSelection(
      produce((state) => {
        playerIds.forEach((playerId) => {
          state[playerId] = undefined;
        });
      })
    );
  };

  return {
    leave,
    select,
    selectedId,
    selection
  };
};

type PlayerSelectionContextState = ReturnType<
  typeof createPlayerSelectionState
>;

const PlayerSelectionContext = createContext<PlayerSelectionContextState>({
  leave: () => void 0,
  select: () => void 0,
  selectedId: () => null,
  selection: {}
});

type PlayerSelectionProviderProps = {
  boardAccess: BoardAccess;
  children: JSX.Element;
};

export const PlayerSelectionProvider: Component<
  PlayerSelectionProviderProps
> = (props) => {
  const value = createPlayerSelectionState(() => props.boardAccess);

  return (
    <PlayerSelectionContext.Provider value={value}>
      {props.children}
    </PlayerSelectionContext.Provider>
  );
};

export const usePlayerSelection = () => {
  return useContext(PlayerSelectionContext);
};

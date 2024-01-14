import {
  REALTIME_LISTEN_TYPES,
  REALTIME_SUBSCRIBE_STATES,
} from "@supabase/supabase-js";
import {
  type Component,
  type JSX,
  createContext,
  createSignal,
  onCleanup,
  onMount,
  useContext,
} from "solid-js";
import { createStore, produce } from "solid-js/store";

import type { BoardAccess } from "~/server/share/db";

import { useSupabase } from "~/contexts/SupabaseContext";

type PlayerSelectionState = Record<string, null | string | undefined>;

const SELECTION_CHANNEL_NAME = "rooms:selections";
const SELECTION_EVENT_NAME = "rooms:selection";

const createPlayerSelectionState = (boardAccess: () => BoardAccess) => {
  const [selectedId, setSelectedId] = createSignal<null | string>(null);

  const [selection, setSelection] = createStore<PlayerSelectionState>({});

  const [sender, setSender] = createSignal(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_selectionId: null | string) => void 0,
  );

  const supabase = useSupabase();

  onMount(() => {
    const channelName = `${SELECTION_CHANNEL_NAME}:${boardAccess().boardId}`;
    const channel = supabase().channel(channelName);

    channel
      .on(
        REALTIME_LISTEN_TYPES.BROADCAST,
        { event: SELECTION_EVENT_NAME },
        (payload) => {
          setSelection(
            produce((state) => {
              state[payload.playerId] = payload.selectionId;
            }),
          );
        },
      )
      .subscribe((status) => {
        if (status !== REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          return;
        }

        setSender(() => (selectionId) => {
          channel.send({
            event: SELECTION_EVENT_NAME,
            selectionId,
            type: REALTIME_LISTEN_TYPES.BROADCAST,
          });
        });
      });

    onCleanup(() => {
      supabase().removeChannel(channel);
    });
  });

  const send = (selectionId: null | string) => {
    sender()(selectionId);
  };

  const leave = (playerIds: string[]) => {
    setSelection(
      produce((state) => {
        playerIds.forEach((playerId) => {
          state[playerId] = undefined;
        });
      }),
    );
  };

  return {
    leave,
    selectedId,
    selection,
    send,
    setSelectedId,
    setSelection,
  };
};

type PlayerSelectionContextState = ReturnType<
  typeof createPlayerSelectionState
>;

const PlayerSelectionContext = createContext<PlayerSelectionContextState>({
  leave: () => void 0,
  selectedId: () => null,
  selection: {},
  send: () => void 0,
  setSelectedId: () => void 0,
  setSelection: () => void 0,
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

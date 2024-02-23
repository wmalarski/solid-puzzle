import { throttle } from "@solid-primitives/scheduled";
import {
  REALTIME_LISTEN_TYPES,
  REALTIME_SUBSCRIBE_STATES
} from "@supabase/supabase-js";
import {
  type Component,
  type JSX,
  createContext,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  useContext
} from "solid-js";
import { createStore, produce } from "solid-js/store";

import type { BoardAccess } from "~/server/access/rpc";

import { getClientSupabase } from "~/utils/supabase";

import { REALTIME_THROTTLE_TIME } from "./const";

type PlayerSelectionState = Record<string, null | string | undefined>;

const SELECTION_CHANNEL_NAME = "rooms:selections";
const SELECTION_EVENT_NAME = "rooms:selection";

const createPlayerSelectionState = (boardAccess: () => BoardAccess) => {
  const [selectedId, setSelectedId] = createSignal<null | string>(null);

  const [selection, setSelection] = createStore<PlayerSelectionState>({});

  const fragmentSelection = createMemo(() => {
    return Object.entries(selection).reduce<Record<string, string>>(
      (prev, [playerId, fragmentId]) => {
        if (fragmentId) {
          prev[fragmentId] = playerId;
        }
        return prev;
      },
      {}
    );
  });

  const [sender, setSender] = createSignal<(arg: null | string) => void>(
    () => void 0
  );

  onMount(() => {
    const supabase = getClientSupabase();
    const channelName = `${SELECTION_CHANNEL_NAME}:${boardAccess().boardId}`;
    const channel = supabase.channel(channelName);

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
            const playerId = boardAccess().playerId;
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
      supabase.removeChannel(channel);
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

  const clear = () => {
    setSelection({});
  };

  return {
    clear,
    fragmentSelection,
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
  clear: () => void 0,
  fragmentSelection: () => ({}),
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

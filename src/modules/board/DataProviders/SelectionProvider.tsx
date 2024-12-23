import { throttle } from "@solid-primitives/scheduled";
import { REALTIME_LISTEN_TYPES } from "@supabase/supabase-js";
import {
  Accessor,
  Component,
  createContext,
  createMemo,
  createSignal,
  ParentProps,
  useContext
} from "solid-js";
import { createStore, produce } from "solid-js/store";

import { useBroadcastChannel } from "./BroadcastProvider";
import { REALTIME_THROTTLE_TIME } from "./const";

const SELECTION_EVENT_NAME = "rooms:selection";

type PlayerSelectionState = Record<string, null | string | undefined>;

type SelectionPayload = {
  playerId: string;
  selectionId: null | string;
};

const createPlayerSelectionState = (playerId: string) => {
  const broadcastChannel = useBroadcastChannel();

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

  const sendBroadcast = throttle((selectionId: null | string) => {
    broadcastChannel().send({
      event: SELECTION_EVENT_NAME,
      payload: { playerId, selectionId },
      type: REALTIME_LISTEN_TYPES.BROADCAST
    });
  }, REALTIME_THROTTLE_TIME);

  const select = (selectionId: null | string) => {
    sendBroadcast(selectionId);
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

  const setRemoteSelection = ({ playerId, selectionId }: SelectionPayload) => {
    setSelection(
      produce((state) => {
        state[playerId] = selectionId;
      })
    );
  };

  const clear = () => {
    setSelection({});
    setSelectedId(null);
  };

  broadcastChannel().on<SelectionPayload>(
    REALTIME_LISTEN_TYPES.BROADCAST,
    { event: SELECTION_EVENT_NAME },
    ({ payload }) => setRemoteSelection(payload)
  );

  return {
    clear,
    fragmentSelection,
    leave,
    select,
    selectedId,
    selection,
    setRemoteSelection
  };
};

const PlayerSelectionContext = createContext<
  Accessor<ReturnType<typeof createPlayerSelectionState>>
>(() => {
  throw new Error("PlayerSelectionContext is not defined");
});

type PlayerSelectionProviderProps = ParentProps<{
  playerId: string;
}>;

export const PlayerSelectionProvider: Component<
  PlayerSelectionProviderProps
> = (props) => {
  const value = createMemo(() => createPlayerSelectionState(props.playerId));

  return (
    <PlayerSelectionContext.Provider value={value}>
      {props.children}
    </PlayerSelectionContext.Provider>
  );
};

export const usePlayerSelection = () => {
  return useContext(PlayerSelectionContext);
};

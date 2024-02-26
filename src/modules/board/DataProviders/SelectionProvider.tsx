import {
  type JSX,
  createContext,
  createMemo,
  createSignal,
  useContext
} from "solid-js";
import { createStore, produce } from "solid-js/store";

type PlayerSelectionState = Record<string, null | string | undefined>;

export type SelectionPayload = {
  playerId: string;
  selectionId: null | string;
};

type PlayerSelectionProviderProps = {
  children: JSX.Element;
  playerId: string;
};

const createPlayerSelectionState = (
  args: () => PlayerSelectionProviderProps
) => {
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

  const [sender, setSender] = createSignal<(arg: SelectionPayload) => void>(
    () => void 0
  );

  const select = (selectionId: null | string) => {
    sender()({ playerId: args().playerId, selectionId });
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

  const setRemoteSender = (sender: (payload: SelectionPayload) => void) => {
    setSender(() => sender);
  };

  const clear = () => {
    setSelection({});
    setSelectedId(null);
  };

  return {
    clear,
    fragmentSelection,
    leave,
    select,
    selectedId,
    selection,
    setRemoteSelection,
    setRemoteSender
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
  selection: {},
  setRemoteSelection: () => void 0,
  setRemoteSender: () => void 0
});

export function PlayerSelectionProvider(props: PlayerSelectionProviderProps) {
  const value = createPlayerSelectionState(() => props);

  return (
    <PlayerSelectionContext.Provider value={value}>
      {props.children}
    </PlayerSelectionContext.Provider>
  );
}

export const usePlayerSelection = () => {
  return useContext(PlayerSelectionContext);
};

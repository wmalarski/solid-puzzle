import { createContext, useContext, type Component, type JSX } from "solid-js";
import { createStore } from "solid-js/store";

export type FragmentState = {
  rotation: number;
  x: number;
  y: number;
};

export type PuzzleState = {
  fragments: Record<string, FragmentState | undefined>;
  selectedId?: string;
};

const usePuzzleStore = () => {
  const [state, setState] = createStore<PuzzleState>({ fragments: {} });

  const setSelectedId = (selectedId?: string) => {
    setState("selectedId", selectedId);
  };

  return { setSelectedId, state };
};

const PuzzleStoreContext = createContext<ReturnType<typeof usePuzzleStore>>({
  setSelectedId: () => void 0,
  state: { fragments: {} },
});

type PuzzleStoreProviderProps = {
  children: JSX.Element;
};

export const PuzzleStoreProvider: Component<PuzzleStoreProviderProps> = (
  props
) => {
  const store = usePuzzleStore();

  return (
    <PuzzleStoreContext.Provider value={store}>
      {props.children}
    </PuzzleStoreContext.Provider>
  );
};

export const usePuzzleStoreContext = () => {
  return useContext(PuzzleStoreContext);
};

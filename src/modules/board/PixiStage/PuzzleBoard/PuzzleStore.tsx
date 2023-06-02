import { createContext, useContext, type Component, type JSX } from "solid-js";
import { createStore } from "solid-js/store";
import type { PuzzleFragmentShape } from "./getPuzzleFragments";

export type FragmentState = {
  rotation: number;
  x: number;
  y: number;
};

export type PuzzleState = {
  fragments: Record<string, FragmentState | undefined>;
  selectedId?: string;
};

type UsePuzzleStoreArgs = {
  shapes: PuzzleFragmentShape[];
};

const usePuzzleStore = (args: UsePuzzleStoreArgs) => {
  const fragments: PuzzleState["fragments"] = {};

  args.shapes.forEach((shape) => {
    fragments[shape.fragmentId] = {
      rotation: 1,
      x: shape.center.x,
      y: shape.center.y,
    };
  });

  const [state, setState] = createStore<PuzzleState>({ fragments });

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
  shapes: PuzzleFragmentShape[];
};

export const PuzzleStoreProvider: Component<PuzzleStoreProviderProps> = (
  props
) => {
  const store = usePuzzleStore(props);

  return (
    <PuzzleStoreContext.Provider value={store}>
      {props.children}
    </PuzzleStoreContext.Provider>
  );
};

export const usePuzzleStoreContext = () => {
  return useContext(PuzzleStoreContext);
};

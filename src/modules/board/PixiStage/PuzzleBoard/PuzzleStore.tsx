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

type SetRotationArgs = {
  fragmentId: string;
  rotation: number;
};

const usePuzzleStore = (args: UsePuzzleStoreArgs) => {
  const fragments: PuzzleState["fragments"] = {};

  args.shapes.forEach((shape) => {
    fragments[shape.fragmentId] = {
      rotation: Math.PI / 45, //2 * Math.random() * Math.PI,
      x: shape.center.x,
      y: shape.center.y,
    };
  });

  const [state, setState] = createStore<PuzzleState>({ fragments });

  const setSelectedId = (selectedId?: string) => {
    setState("selectedId", selectedId);
  };

  const setRotation = ({ fragmentId, rotation }: SetRotationArgs) => {
    setState("fragments", fragmentId, "rotation", rotation);
  };

  return { setRotation, setSelectedId, state };
};

const PuzzleStoreContext = createContext<ReturnType<typeof usePuzzleStore>>({
  setRotation: () => void 0,
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

import { createContext, useContext, type Component, type JSX } from "solid-js";
import { createStore } from "solid-js/store";
import type { PuzzleFragmentShape } from "./getPuzzleFragments";

export type FragmentState = {
  fragmentId: string;
  rotation: number;
  x: number;
  y: number;
  shape: PuzzleFragmentShape;
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

type SetPositionArgs = {
  fragmentId: string;
  x: number;
  y: number;
};

const usePuzzleStore = (args: UsePuzzleStoreArgs) => {
  const fragments: PuzzleState["fragments"] = {};
  const shapes = new Map<string, PuzzleFragmentShape>();

  args.shapes.forEach((shape) => {
    fragments[shape.fragmentId] = {
      fragmentId: shape.fragmentId,
      rotation: shape.initialRotation,
      shape,
      x: shape.start.x,
      y: shape.start.y,
    };
  });

  const [state, setState] = createStore<PuzzleState>({ fragments });

  const setSelectedId = (selectedId?: string) => {
    setState("selectedId", selectedId);
  };

  const setRotation = ({ fragmentId, rotation }: SetRotationArgs) => {
    setState("fragments", fragmentId, "rotation", rotation);
  };

  const setPosition = ({ fragmentId, x, y }: SetPositionArgs) => {
    setState("fragments", fragmentId, "x", x);
    setState("fragments", fragmentId, "y", y);
  };

  return {
    setPosition,
    setRotation,
    setSelectedId,
    shapes: shapes as ReadonlyMap<string, PuzzleFragmentShape>,
    state,
  };
};

const PuzzleStoreContext = createContext<ReturnType<typeof usePuzzleStore>>({
  setPosition: () => void 0,
  setRotation: () => void 0,
  setSelectedId: () => void 0,
  shapes: new Map(),
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

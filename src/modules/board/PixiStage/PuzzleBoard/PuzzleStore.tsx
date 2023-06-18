import { createContext, useContext, type Component, type JSX } from "solid-js";
import { createStore } from "solid-js/store";
import { getDistance } from "~/utils/geometry";
import type { PuzzleFragmentShape } from "~/utils/getPuzzleFragments";

export type FragmentState = {
  isLocked: boolean;
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
      isLocked: false,
      rotation: shape.initialRotation,
      x: shape.center.x,
      y: shape.center.y,
    };
  });

  const [state, setState] = createStore<PuzzleState>({ fragments });

  const setSelectedId = (selectedId?: string) => {
    setState("selectedId", selectedId);
  };

  const checkOnPlace = (fragmentId: string) => {
    const fragment = state.fragments[fragmentId];
    const shape = shapes.get(fragmentId);
    if (fragment && shape) {
      const distance = getDistance(fragment, shape.center);
      const isRightAngle = Math.abs(fragment.rotation) < Math.PI / 32;
      const isLocked = distance < 20 && isRightAngle;
      setState("fragments", fragmentId, "isLocked", isLocked);
    }
  };

  const setRotation = ({ fragmentId, rotation }: SetRotationArgs) => {
    setState("fragments", fragmentId, "rotation", rotation);
    checkOnPlace(fragmentId);
  };

  const setPosition = ({ fragmentId, x, y }: SetPositionArgs) => {
    setState("fragments", fragmentId, "x", x);
    setState("fragments", fragmentId, "y", y);
    checkOnPlace(fragmentId);
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

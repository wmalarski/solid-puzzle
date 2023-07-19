import { createContext, useContext, type Component, type JSX } from "solid-js";
import { createStore } from "solid-js/store";
import { createSubscription } from "~/lib/solid-replicache";
import { getDistance } from "~/utils/geometry";
import type { PuzzleFragmentShape } from "~/utils/getPuzzleFragments";
import {
  getFragmentKey,
  useReplicache,
  type FragmentState,
} from "../../ReplicacheClient";

export type PuzzleState = {
  selectedId?: string;
};

type UsePuzzleStoreArgs = {
  boardId: string;
  shapes: PuzzleFragmentShape[];
};

const usePuzzleStore = (args: UsePuzzleStoreArgs) => {
  const shapes = new Map<string, PuzzleFragmentShape>();

  args.shapes.forEach((shape) => {
    shapes.set(shape.fragmentId, shape);
  });

  const replicache = useReplicache();

  const [state, setState] = createStore<PuzzleState>({});

  const setSelectedId = (selectedId?: string) => {
    setState("selectedId", selectedId);
  };

  const isLockedInPlace = (fragment: FragmentState) => {
    const shape = shapes.get(fragment.fragmentId);
    if (!fragment || !shape) {
      return false;
    }
    const distance = getDistance(fragment, shape.center);
    const isRightAngle = Math.abs(fragment.rotation) < Math.PI / 32;
    const isLocked = distance < 20 && isRightAngle;
    return isLocked;
  };

  const setFragmentState = (fragment: FragmentState) => {
    const isLocked = isLockedInPlace(fragment);
    replicache().mutate.setFragmentState({
      boardId: args.boardId,
      state: { ...fragment, isLocked },
    });
  };

  const createFragmentSubscription = (fragmentId: () => string) => {
    return createSubscription(
      replicache(),
      async (tx) => {
        const key = getFragmentKey({
          boardId: args.boardId,
          fragmentId: fragmentId(),
        });
        const fragment = await tx.get(key);
        return fragment as FragmentState | null;
      },
      null
    );
  };

  return {
    createFragmentSubscription,
    setFragmentState,
    setSelectedId,
    shapes: args.shapes,
    state,
  };
};

const PuzzleStoreContext = createContext<ReturnType<typeof usePuzzleStore>>({
  createFragmentSubscription: () => () => null,
  setFragmentState: () => void 0,
  setSelectedId: () => void 0,
  shapes: [],
  state: {},
});

type PuzzleStoreProviderProps = {
  boardId: string;
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

import { createContext, useContext, type Component, type JSX } from "solid-js";
import { createStore } from "solid-js/store";
import { getDistance } from "~/utils/geometry";
import type { PuzzleFragmentShape } from "~/utils/getPuzzleFragments";

export type FragmentState = {
  fragmentId: string;
  isLocked: boolean;
  rotation: number;
  x: number;
  y: number;
};

type PuzzleState = Record<string, FragmentState | undefined>;

type SetFragmentStateArgs = {
  fragmentId: string;
  rotation: number;
  x: number;
  y: number;
};

type CreatePuzzleContextArgs = {
  boardId: string;
  shapes: PuzzleFragmentShape[];
};

const createPuzzleContext = (args: CreatePuzzleContextArgs) => {
  const init: PuzzleState = {};
  const shapes = new Map<string, PuzzleFragmentShape>();

  args.shapes.forEach((shape) => {
    shapes.set(shape.fragmentId, shape);
    init[shape.fragmentId] = {
      fragmentId: shape.fragmentId,
      isLocked: false,
      rotation: shape.initialRotation,
      x: shape.center.x,
      y: shape.center.y,
    };
  });

  const [fragments, setFragments] = createStore<PuzzleState>(init);

  const isLockedInPlace = (fragment: SetFragmentStateArgs) => {
    const shape = shapes.get(fragment.fragmentId);
    if (!fragment || !shape) {
      return false;
    }
    const distance = getDistance(fragment, shape.center);
    const isRightAngle = Math.abs(fragment.rotation) < Math.PI / 32;
    const isLocked = distance < 20 && isRightAngle;
    return isLocked;
  };

  const setFragmentState = (fragment: SetFragmentStateArgs) => {
    const isLocked = isLockedInPlace(fragment);

    setFragments(fragment.fragmentId, "isLocked", isLocked);
    setFragments(fragment.fragmentId, "rotation", fragment.rotation);
    setFragments(fragment.fragmentId, "x", fragment.x);
    setFragments(fragment.fragmentId, "y", fragment.y);
  };

  return { fragments, setFragmentState };
};

type PuzzleContextState = ReturnType<typeof createPuzzleContext>;

const PuzzleStateContext = createContext<PuzzleContextState>({
  fragments: {},
  setFragmentState: () => void 0,
});

type PuzzleStateProviderProps = CreatePuzzleContextArgs & {
  children: JSX.Element;
};

export const PuzzleStateProvider: Component<PuzzleStateProviderProps> = (
  props,
) => {
  const value = createPuzzleContext(props);

  return (
    <PuzzleStateContext.Provider value={value}>
      {props.children}
    </PuzzleStateContext.Provider>
  );
};

export const usePuzzleState = () => {
  return useContext(PuzzleStateContext);
};

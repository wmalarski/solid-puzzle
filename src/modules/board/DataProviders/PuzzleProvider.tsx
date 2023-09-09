import {
  createContext,
  createSignal,
  useContext,
  type Component,
  type JSX,
} from "solid-js";
import { createStore } from "solid-js/store";
import type { BoardModel } from "~/server/board/types";
import { getDistance } from "~/utils/geometry";
import {
  getPuzzleFragments,
  type PuzzleFragmentShape,
  type PuzzleShapeLine,
} from "~/utils/getPuzzleFragments";

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

type InitFragmentsArgs = {
  board: BoardModel;
  width: number;
  height: number;
};

const createPuzzleContext = () => {
  const init: PuzzleState = {};

  const [fragments, setFragments] = createStore<PuzzleState>(init);
  const [shapes, setShapes] = createSignal<
    ReadonlyMap<string, PuzzleFragmentShape>
  >(new Map());
  const [lines, setLines] = createSignal<readonly PuzzleShapeLine[]>([]);

  const isLockedInPlace = (fragment: SetFragmentStateArgs) => {
    const shape = shapes().get(fragment.fragmentId);
    if (!fragment || !shape) {
      return false;
    }
    const distance = getDistance(fragment, shape.center);
    const isRightAngle = Math.abs(fragment.rotation) < Math.PI / 32;
    const isLocked = distance < 20 && isRightAngle;
    return isLocked;
  };

  const initFragments = ({ board, height, width }: InitFragmentsArgs) => {
    const shapesMap = new Map<string, PuzzleFragmentShape>();

    const config = JSON.parse(board.config);

    const shapes = getPuzzleFragments({ config, height, width });

    shapes.fragments.forEach((shape) => {
      shapesMap.set(shape.fragmentId, shape);
      init[shape.fragmentId] = {
        fragmentId: shape.fragmentId,
        isLocked: false,
        rotation: shape.initialRotation,
        x: shape.center.x,
        y: shape.center.y,
      };
    });

    setShapes(shapesMap);
    setLines(shapes.lines);
  };

  const setFragmentState = (fragment: SetFragmentStateArgs) => {
    const isLocked = isLockedInPlace(fragment);

    setFragments(fragment.fragmentId, "isLocked", isLocked);
    setFragments(fragment.fragmentId, "rotation", fragment.rotation);
    setFragments(fragment.fragmentId, "x", fragment.x);
    setFragments(fragment.fragmentId, "y", fragment.y);
  };

  return {
    fragments,
    initFragments,
    lines,
    setFragmentState,
    shapes,
  };
};

type PuzzleContextState = ReturnType<typeof createPuzzleContext>;

const PuzzleStateContext = createContext<PuzzleContextState>({
  fragments: {},
  initFragments: () => void 0,
  lines: () => [],
  setFragmentState: () => void 0,
  shapes: () => new Map(),
});

type PuzzleStateProviderProps = {
  children: JSX.Element;
};

export const PuzzleStateProvider: Component<PuzzleStateProviderProps> = (
  props,
) => {
  const value = createPuzzleContext();

  return (
    <PuzzleStateContext.Provider value={value}>
      {props.children}
    </PuzzleStateContext.Provider>
  );
};

export const usePuzzleState = () => {
  return useContext(PuzzleStateContext);
};

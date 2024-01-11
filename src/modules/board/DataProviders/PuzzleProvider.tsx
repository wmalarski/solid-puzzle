import {
  type Component,
  type JSX,
  createContext,
  createSignal,
  useContext,
} from "solid-js";
import { createStore, produce } from "solid-js/store";

import type { BoardModel } from "~/server/board/types";

import { getDistance } from "~/utils/geometry";
import {
  type PuzzleConfig,
  type PuzzleFragmentShape,
  getPuzzleFragments,
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
  height: number;
  width: number;
};

const createPuzzleContext = () => {
  const [fragments, setFragments] = createStore<PuzzleState>({});

  const [shapes, setShapes] = createSignal<
    ReadonlyMap<string, PuzzleFragmentShape>
  >(new Map());

  const [config, setConfig] = createSignal<PuzzleConfig>({
    fragments: [],
    lines: [],
  });

  const isLockedInPlace = (fragment: SetFragmentStateArgs) => {
    const shape = shapes().get(fragment.fragmentId);

    if (!fragment || !shape) {
      return false;
    }
    const distance = getDistance(fragment, shape.min);
    const isRightAngle =
      Math.abs(fragment.rotation) % (2 * Math.PI) < Math.PI / 32;
    const isLocked = distance < 20 && isRightAngle;

    return isLocked;
  };

  const initFragments = ({ board, height, width }: InitFragmentsArgs) => {
    const shapesMap = new Map<string, PuzzleFragmentShape>();
    const init: PuzzleState = {};

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

    setConfig(shapes);
    setFragments(init);
    setShapes(shapesMap);
  };

  const setFragmentState = (fragment: SetFragmentStateArgs) => {
    setFragments(
      produce((state) => {
        const currentFragment = state[fragment.fragmentId];
        if (currentFragment) {
          currentFragment.rotation = fragment.rotation;
          currentFragment.x = fragment.x;
          currentFragment.y = fragment.y;
        }
      }),
    );
  };

  const setFragmentStateWithLockCheck = (fragment: SetFragmentStateArgs) => {
    setFragments(
      produce((state) => {
        const currentFragment = state[fragment.fragmentId];
        if (currentFragment) {
          currentFragment.rotation = fragment.rotation;
          currentFragment.x = fragment.x;
          currentFragment.y = fragment.y;
          currentFragment.isLocked = isLockedInPlace(fragment);
        }
      }),
    );
  };

  return {
    config,
    fragments,
    initFragments,
    setFragmentState,
    setFragmentStateWithLockCheck,
    shapes,
  };
};

type PuzzleContextState = ReturnType<typeof createPuzzleContext>;

const PuzzleStateContext = createContext<PuzzleContextState>({
  config: () => ({ fragments: [], lines: [] }),
  fragments: {},
  initFragments: () => void 0,
  setFragmentState: () => void 0,
  setFragmentStateWithLockCheck: () => void 0,
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

export const usePuzzleStore = () => {
  return useContext(PuzzleStateContext);
};

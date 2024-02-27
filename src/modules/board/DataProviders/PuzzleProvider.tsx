import {
  type JSX,
  createContext,
  createMemo,
  createSignal,
  useContext
} from "solid-js";
import { createStore, produce } from "solid-js/store";

import type { BoardAccess } from "~/server/access/rpc";
import type { BoardModel, FragmentModel } from "~/types/models";

import { useUpdateFragment } from "~/server/board/client";
import { getDistance } from "~/utils/geometry";
import {
  type PuzzleCurveConfig,
  type PuzzleFragmentShape,
  getPuzzleFragments
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

type IsLockedInPlaceArgs = {
  fragment: SetFragmentStateArgs;
  shapes: ReadonlyMap<string, PuzzleFragmentShape>;
};

const isLockedInPlace = ({ fragment, shapes }: IsLockedInPlaceArgs) => {
  const shape = shapes.get(fragment.fragmentId);

  if (!fragment || !shape) {
    return false;
  }
  const distance = getDistance(fragment, shape.min);

  const absAngle = Math.abs(fragment.rotation);
  const closeTo0 = absAngle < Math.PI / 32;
  const closeTo2Pi = 2 * Math.PI - absAngle < Math.PI / 32;
  const isLocked = distance < 20 && (closeTo0 || closeTo2Pi);

  return isLocked;
};

type PuzzleStateProviderProps = {
  board: BoardModel;
  boardAccess: BoardAccess;
  children: JSX.Element;
  fragments: FragmentModel[];
};

const createPuzzleContext = (args: () => PuzzleStateProviderProps) => {
  const updateFragment = useUpdateFragment();

  const config = createMemo(() => {
    const value = args();
    return getPuzzleFragments({
      config: value.board.config as PuzzleCurveConfig,
      height: value.board.height,
      width: value.board.width
    });
  });

  const shapes = createMemo(() => {
    const shapesMap = new Map<string, PuzzleFragmentShape>();

    const fragmentsConfig = config().fragments;

    args().fragments.forEach((fragment) => {
      const shape = fragmentsConfig[fragment.index];
      shapesMap.set(fragment.id, shape);
    });

    return shapesMap;
  });

  const fragmentsIds = createMemo(() => {
    return args().fragments.map((fragment) => fragment.id);
  });

  const store = createMemo(() => {
    const init: PuzzleState = {};

    args().fragments.forEach((fragment) => {
      init[fragment.id] = {
        fragmentId: fragment.id,
        isLocked: fragment.is_locked,
        rotation: fragment.rotation,
        x: fragment.x,
        y: fragment.y
      };
    });

    const [value, set] = createStore<PuzzleState>(init);
    return { set, value };
  });

  const [sender, setSender] = createSignal<(args: FragmentState) => void>(
    () => void 0
  );

  const setFragmentState = (update: SetFragmentStateArgs) => {
    store().set(
      produce((state) => {
        const fragment = state[update.fragmentId];
        if (fragment) {
          fragment.rotation = update.rotation;
          fragment.x = update.x;
          fragment.y = update.y;
        }
      })
    );
  };

  const sendFragmentState = (update: SetFragmentStateArgs) => {
    sender()({ ...update, isLocked: false });
  };

  const setFragmentStateWithLockCheck = async (
    update: SetFragmentStateArgs
  ) => {
    const isLocked = isLockedInPlace({
      fragment: update,
      shapes: shapes()
    });

    sender()({ ...update, isLocked });

    await updateFragment({
      fragmentId: update.fragmentId,
      isLocked,
      rotation: update.rotation,
      x: update.x,
      y: update.y
    });

    store().set(
      produce((state) => {
        const fragment = state[update.fragmentId];
        if (fragment) {
          fragment.rotation = update.rotation;
          fragment.x = update.x;
          fragment.y = update.y;
          fragment.isLocked = isLocked;
        }
      })
    );
  };

  const fragments = createMemo(() => {
    return store().value;
  });

  const unfinishedCount = createMemo(() => {
    const values = Object.values(store().value);
    const unfinished = values.filter((state) => !state?.isLocked);
    return unfinished.length;
  });

  const isFinished = createMemo(() => {
    return unfinishedCount() === 0;
  });

  const setRemoteSender = (sender: (payload: FragmentState) => void) => {
    setSender(() => sender);
  };

  const setRemoteFragment = (payload: FragmentState) => {
    store().set(
      produce((state) => {
        const fragment = state[payload.fragmentId];
        if (fragment) {
          fragment.rotation = payload.rotation;
          fragment.x = payload.x;
          fragment.y = payload.y;
          fragment.isLocked = payload.isLocked;
        }
      })
    );
  };

  return {
    config,
    fragments,
    fragmentsIds,
    isFinished,
    sendFragmentState,
    setFragmentState,
    setFragmentStateWithLockCheck,
    setRemoteFragment,
    setRemoteSender,
    shapes,
    unfinishedCount
  };
};

type PuzzleContextState = ReturnType<typeof createPuzzleContext>;

const PuzzleStateContext = createContext<PuzzleContextState>({
  config: () => ({ fragments: [], lines: [] }),
  fragments: () => ({}),
  fragmentsIds: () => [],
  isFinished: () => false,
  sendFragmentState: () => void 0,
  setFragmentState: () => void 0,
  setFragmentStateWithLockCheck: () => Promise.resolve(),
  setRemoteFragment: () => void 0,
  setRemoteSender: () => void 0,
  shapes: () => new Map(),
  unfinishedCount: () => 0
});

export function PuzzleStateProvider(props: PuzzleStateProviderProps) {
  const value = createPuzzleContext(() => props);

  return (
    <PuzzleStateContext.Provider value={value}>
      {props.children}
    </PuzzleStateContext.Provider>
  );
}

export const usePuzzleStore = () => {
  return useContext(PuzzleStateContext);
};

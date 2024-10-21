import { throttle } from "@solid-primitives/scheduled";
import { REALTIME_LISTEN_TYPES } from "@supabase/supabase-js";
import {
  Accessor,
  Component,
  createContext,
  createMemo,
  ParentProps,
  useContext
} from "solid-js";
import { createStore, produce } from "solid-js/store";

import type { BoardAccess } from "~/server/access/rpc";
import type { BoardModel, FragmentModel } from "~/types/models";

import { useUpdateFragment } from "~/server/board/client";
import { getDistance } from "~/utils/geometry";
import {
  getPuzzleFragments,
  type PuzzleCurveConfig,
  type PuzzleFragmentShape
} from "~/utils/getPuzzleFragments";

import { useBroadcastChannel } from "./BroadcastProvider";
import { REALTIME_THROTTLE_TIME } from "./const";

const PUZZLE_EVENT_NAME = "rooms:puzzle";

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

type CreatePuzzleContextArgs = {
  board: BoardModel;
  boardAccess: BoardAccess;
  fragments: FragmentModel[];
};

const createPuzzleContext = (args: CreatePuzzleContextArgs) => {
  const broadcastChannel = useBroadcastChannel();
  const updateFragment = useUpdateFragment();

  const config = getPuzzleFragments({
    config: args.board.config as PuzzleCurveConfig,
    height: args.board.height,
    width: args.board.width
  });

  const shapes = new Map<string, PuzzleFragmentShape>();

  const fragmentsConfig = config.fragments;

  args.fragments.forEach((fragment) => {
    const shape = fragmentsConfig[fragment.index];
    shapes.set(fragment.id, shape);
  });

  const fragmentsIds = args.fragments.map((fragment) => fragment.id);

  const init: PuzzleState = {};

  args.fragments.forEach((fragment) => {
    init[fragment.id] = {
      fragmentId: fragment.id,
      isLocked: fragment.is_locked,
      rotation: fragment.rotation,
      x: fragment.x,
      y: fragment.y
    };
  });

  const [fragments, setFragments] = createStore<PuzzleState>(init);

  const setFragmentState = (update: SetFragmentStateArgs) => {
    setFragments(
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

  const sendPayload = throttle((payload: FragmentState) => {
    broadcastChannel().send({
      event: PUZZLE_EVENT_NAME,
      payload,
      type: REALTIME_LISTEN_TYPES.BROADCAST
    });
  }, REALTIME_THROTTLE_TIME);

  const sendFragmentState = (update: SetFragmentStateArgs) => {
    sendPayload({ ...update, isLocked: false });
  };

  const setFragmentStateWithLockCheck = async (
    update: SetFragmentStateArgs
  ) => {
    const isLocked = isLockedInPlace({
      fragment: update,
      shapes: shapes
    });

    sendPayload({ ...update, isLocked });

    await updateFragment({
      fragmentId: update.fragmentId,
      isLocked,
      rotation: update.rotation,
      x: update.x,
      y: update.y
    });

    setFragments(
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

  const unfinishedCount = createMemo(() => {
    const values = Object.values(fragments);
    const unfinished = values.filter((state) => !state?.isLocked);
    return unfinished.length;
  });

  const isFinished = createMemo(() => {
    return unfinishedCount() === 0;
  });

  const setRemoteFragment = (payload: FragmentState) => {
    setFragments(
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

  broadcastChannel().on<FragmentState>(
    REALTIME_LISTEN_TYPES.BROADCAST,
    { event: PUZZLE_EVENT_NAME },
    ({ payload }) => setRemoteFragment(payload)
  );

  return {
    config,
    fragments,
    fragmentsIds,
    isFinished,
    sendFragmentState,
    setFragmentState,
    setFragmentStateWithLockCheck,
    shapes,
    unfinishedCount
  };
};

const PuzzleStateContext = createContext<
  Accessor<ReturnType<typeof createPuzzleContext>>
>(() => {
  throw new Error("PuzzleStateContext is not defined");
});

type PuzzleStateProviderProps = ParentProps<{
  board: BoardModel;
  boardAccess: BoardAccess;
  fragments: FragmentModel[];
}>;

export const PuzzleStateProvider: Component<PuzzleStateProviderProps> = (
  props
) => {
  const value = createMemo(() =>
    createPuzzleContext({
      board: props.board,
      boardAccess: props.boardAccess,
      fragments: props.fragments
    })
  );

  return (
    <PuzzleStateContext.Provider value={value}>
      {props.children}
    </PuzzleStateContext.Provider>
  );
};

export const usePuzzleStore = () => {
  return useContext(PuzzleStateContext);
};

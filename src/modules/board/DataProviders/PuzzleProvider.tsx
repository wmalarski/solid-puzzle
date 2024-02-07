import { throttle } from "@solid-primitives/scheduled";
import {
  REALTIME_LISTEN_TYPES,
  REALTIME_SUBSCRIBE_STATES
} from "@supabase/supabase-js";
import {
  type Component,
  type JSX,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  useContext
} from "solid-js";
import { createStore, produce } from "solid-js/store";

import type { BoardAccess, BoardModel, FragmentModel } from "~/types/models";

import { useSupabase } from "~/contexts/SupabaseContext";
import { useUpdateFragment } from "~/server/board/client";
import { getDistance } from "~/utils/geometry";
import {
  type PuzzleCurveConfig,
  type PuzzleFragmentShape,
  getPuzzleFragments
} from "~/utils/getPuzzleFragments";

import { REALTIME_THROTTLE_TIME } from "./const";

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

const PUZZLE_CHANNEL_NAME = "rooms:puzzle";
const PUZZLE_EVENT_NAME = "rooms:puzzle";

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
  const isRightAngle =
    Math.abs(fragment.rotation) % (2 * Math.PI) < Math.PI / 32;
  const isLocked = distance < 20 && isRightAngle;

  return isLocked;
};

type CreatePuzzleContextArgs = () => {
  board: BoardModel;
  boardAccess: BoardAccess;
  fragments: FragmentModel[];
};

const createPuzzleContext = (args: CreatePuzzleContextArgs) => {
  const updateFragment = useUpdateFragment();

  const config = createMemo(() => {
    return getPuzzleFragments({
      config: args().board.config as PuzzleCurveConfig,
      height: args().board.height,
      width: args().board.width
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_args: FragmentState) => void 0
  );

  const supabase = useSupabase();

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
    const isLocked = isLockedInPlace({
      fragment: update,
      shapes: shapes()
    });

    sender()({ ...update, isLocked });
  };

  const setFragmentStateWithLockCheck = (update: SetFragmentStateArgs) => {
    const isLocked = isLockedInPlace({
      fragment: update,
      shapes: shapes()
    });

    sender()({ ...update, isLocked });

    updateFragment({
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

  createEffect(() => {
    const channelName = `${PUZZLE_CHANNEL_NAME}:${args().board.id}`;
    const channel = supabase().channel(channelName);
    const playerId = args().boardAccess.playerId;
    const fragmentsStore = store();

    channel
      .on(
        REALTIME_LISTEN_TYPES.BROADCAST,
        { event: PUZZLE_EVENT_NAME },
        (payload) => {
          fragmentsStore.set(
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
        }
      )
      .subscribe((status) => {
        if (status !== REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          return;
        }

        setSender(() =>
          throttle((update: SetFragmentStateArgs) => {
            channel.send({
              event: PUZZLE_EVENT_NAME,
              playerId,
              type: REALTIME_LISTEN_TYPES.BROADCAST,
              ...update
            });
          }, REALTIME_THROTTLE_TIME)
        );
      });

    onCleanup(() => {
      supabase().removeChannel(channel);
    });
  });

  const fragments = createMemo(() => {
    return store().value;
  });

  return {
    config,
    fragments,
    fragmentsIds,
    sendFragmentState,
    setFragmentState,
    setFragmentStateWithLockCheck,
    shapes
  };
};

type PuzzleContextState = ReturnType<typeof createPuzzleContext>;

const PuzzleStateContext = createContext<PuzzleContextState>({
  config: () => ({ fragments: [], lines: [] }),
  fragments: () => ({}),
  fragmentsIds: () => [],
  sendFragmentState: () => void 0,
  setFragmentState: () => void 0,
  setFragmentStateWithLockCheck: () => void 0,
  shapes: () => new Map()
});

type PuzzleStateProviderProps = {
  board: BoardModel;
  boardAccess: BoardAccess;
  children: JSX.Element;
  fragments: FragmentModel[];
};

export const PuzzleStateProvider: Component<PuzzleStateProviderProps> = (
  props
) => {
  const value = createPuzzleContext(() => props);

  return (
    <PuzzleStateContext.Provider value={value}>
      {props.children}
    </PuzzleStateContext.Provider>
  );
};

export const usePuzzleStore = () => {
  return useContext(PuzzleStateContext);
};

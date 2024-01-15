import {
  REALTIME_LISTEN_TYPES,
  REALTIME_SUBSCRIBE_STATES,
} from "@supabase/supabase-js";
import {
  type Component,
  type JSX,
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  useContext,
} from "solid-js";
import { createStore, produce } from "solid-js/store";

import type { BoardModel } from "~/server/board/types";
import type { BoardAccess } from "~/server/share/db";

import { useSupabase } from "~/contexts/SupabaseContext";
import { getDistance } from "~/utils/geometry";
import {
  type PuzzleConfig,
  type PuzzleFragmentShape,
  getPuzzleFragments,
} from "~/utils/getPuzzleFragments";

import { usePlayerPresence } from "./PresenceProvider";

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

const createPuzzleContext = (boardAccess: () => BoardAccess) => {
  const presence = usePlayerPresence();

  const [fragments, setFragments] = createStore<PuzzleState>({});

  const [shapes, setShapes] = createSignal<
    ReadonlyMap<string, PuzzleFragmentShape>
  >(new Map());

  const [config, setConfig] = createSignal<PuzzleConfig>({
    fragments: [],
    lines: [],
  });

  const [sender, setSender] = createSignal(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_args: SetFragmentStateArgs) => void 0,
  );

  const supabase = useSupabase();

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

  const setFragmentState = (update: SetFragmentStateArgs) => {
    setFragments(
      produce((state) => {
        const fragment = state[update.fragmentId];
        if (fragment) {
          fragment.rotation = update.rotation;
          fragment.x = update.x;
          fragment.y = update.y;
        }
      }),
    );
  };

  const setFragmentStateWithLockCheck = (update: SetFragmentStateArgs) => {
    sender()(update);
    setFragments(
      produce((state) => {
        const fragment = state[update.fragmentId];
        if (fragment) {
          fragment.rotation = update.rotation;
          fragment.x = update.x;
          fragment.y = update.y;
          fragment.isLocked = isLockedInPlace({
            fragment: update,
            shapes: shapes(),
          });
        }
      }),
    );
  };

  createEffect(() => {
    const channelName = `${PUZZLE_CHANNEL_NAME}:${boardAccess().boardId}`;
    const channel = supabase().channel(channelName);
    const playerId = presence.currentPlayer().playerId;
    const puzzleShapes = shapes();

    channel
      .on(
        REALTIME_LISTEN_TYPES.BROADCAST,
        { event: PUZZLE_EVENT_NAME },
        (payload) => {
          setFragments(
            produce((state) => {
              const fragment = state[payload.fragmentId];
              if (fragment) {
                fragment.rotation = payload.rotation;
                fragment.x = payload.x;
                fragment.y = payload.y;
                fragment.isLocked = isLockedInPlace({
                  fragment,
                  shapes: puzzleShapes,
                });
              }
            }),
          );
        },
      )
      .subscribe((status) => {
        if (status !== REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          return;
        }

        setSender(() => (update) => {
          channel.send({
            event: PUZZLE_EVENT_NAME,
            playerId,
            type: REALTIME_LISTEN_TYPES.BROADCAST,
            ...update,
          });
        });
      });

    onCleanup(() => {
      supabase().removeChannel(channel);
    });
  });

  const sendFragmentState = (update: SetFragmentStateArgs) => {
    sender()(update);
  };

  return {
    config,
    fragments,
    initFragments,
    sendFragmentState,
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
  sendFragmentState: () => void 0,
  setFragmentState: () => void 0,
  setFragmentStateWithLockCheck: () => void 0,
  shapes: () => new Map(),
});

type PuzzleStateProviderProps = {
  boardAccess: BoardAccess;
  children: JSX.Element;
};

export const PuzzleStateProvider: Component<PuzzleStateProviderProps> = (
  props,
) => {
  const value = createPuzzleContext(() => props.boardAccess);

  return (
    <PuzzleStateContext.Provider value={value}>
      {props.children}
    </PuzzleStateContext.Provider>
  );
};

export const usePuzzleStore = () => {
  return useContext(PuzzleStateContext);
};

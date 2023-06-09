import { createContext, useContext, type Component, type JSX } from "solid-js";
import { createStore } from "solid-js/store";
import { getDistance, subtractPoint, type Point2D } from "~/utils/geometry";
import type { PuzzleFragmentShape } from "./getPuzzleFragments";

export type FragmentState = {
  fragmentId: string;
  islandId: string;
  rotation: number;
  x: number;
  y: number;
};

export type IslandState = {
  fragments: Record<string, FragmentState | undefined>;
  islandId: string;
  rotation: number;
  x: number;
  y: number;
};

export type PuzzleState = {
  islands: Record<string, IslandState | undefined>;
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

type AddConnectionArgs = {
  islandId: string;
  fragmentId: string;
};

const usePuzzleStore = (args: UsePuzzleStoreArgs) => {
  const islands: PuzzleState["islands"] = {};
  const shapes = new Map<string, PuzzleFragmentShape>();

  args.shapes.forEach((shape, index) => {
    const rotation = 2 * Math.random() * Math.PI;
    const islandId = String(Math.floor(index / 2));
    shapes.set(shape.fragmentId, shape);

    const fragment = {
      fragmentId: shape.fragmentId,
      islandId,
      rotation,
      x: shape.start.x,
      y: shape.start.y,
    };

    const current = islands[islandId];
    if (current) {
      current.fragments[fragment.fragmentId] = fragment;
      return;
    }
    islands[islandId] = {
      fragments: { [fragment.fragmentId]: fragment },
      islandId,
      rotation,
      x: shape.start.x,
      y: shape.start.y,
    };
  });

  const [state, setState] = createStore<PuzzleState>({ islands });

  const setSelectedId = (selectedId?: string) => {
    setState("selectedId", selectedId);
  };

  const setRotation = ({ fragmentId: islandId, rotation }: SetRotationArgs) => {
    setState("islands", islandId, "rotation", rotation);
  };

  const setPosition = ({ fragmentId, x, y }: SetPositionArgs) => {
    // setState("fragments", fragmentId, "x", x);
    // setState("fragments", fragmentId, "y", y);
  };

  const addConnection = ({ fragmentId, islandId }: AddConnectionArgs) => {
    // const originalIslandId = state.fragments[fragmentId]?.islandId;
    // if (!originalIslandId) {
    //   return;
    // }
    // const allFragments = state.islands[originalIslandId]?.fragments || [];
    // allFragments.forEach((fragmentId) => {
    //   setState("fragments", fragmentId, "islandId", islandId);
    // });
    // setState("islands", originalIslandId, undefined);
    // setState("islands", islandId, "fragments", (current) => [
    //   ...(current || []),
    //   ...allFragments,
    // ]);
  };

  return {
    addConnection,
    setPosition,
    setRotation,
    setSelectedId,
    shapes: shapes as ReadonlyMap<string, PuzzleFragmentShape>,
    state,
  };
};

const PuzzleStoreContext = createContext<ReturnType<typeof usePuzzleStore>>({
  addConnection: () => void 0,
  setPosition: () => void 0,
  setRotation: () => void 0,
  setSelectedId: () => void 0,
  shapes: new Map(),
  state: { islands: {} },
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

type ArePuzzleFragmentsCloseArgs = {
  correctDistance: number;
  correctShift: Point2D;
  fragment: Omit<FragmentState, "islandId">;
  neighbor: FragmentState;
};

export const arePuzzleFragmentsClose = ({
  correctDistance,
  fragment,
  neighbor,
  correctShift,
}: ArePuzzleFragmentsCloseArgs) => {
  const distance = getDistance(fragment, neighbor);
  const isClose = Math.abs(distance - correctDistance) < 10;

  const isSameAngle =
    Math.abs(fragment.rotation - neighbor.rotation) < Math.PI / 16;

  const shift = subtractPoint(fragment, neighbor);
  const isCorrectPosition =
    shift.x * correctShift.x >= 0 && shift.y * correctShift.y >= 0;

  return isClose && isSameAngle && isCorrectPosition;
};

// type FindCloseNeighborArgs = {
//   fragment: FragmentState;
//   fragments: PuzzleState["fragments"];
//   neighbors: PuzzleFragmentNeighbors;
// };

// export const findCloseNeighbor = ({
//   fragment,
//   fragments,
//   neighbors,
// }: FindCloseNeighborArgs) => {
//   return neighbors.find((neighbor) => {
//     const neighborState = fragments[neighbor.id];
//     if (neighborState && neighborState.islandId !== fragment.islandId) {
//       return arePuzzleFragmentsClose({
//         correctDistance: neighbor.distance,
//         correctShift: neighbor.shift,
//         fragment,
//         neighbor: neighborState,
//       });
//     }
//   });
// };

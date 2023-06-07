import { createContext, useContext, type Component, type JSX } from "solid-js";
import { createStore } from "solid-js/store";
import { getDistance, subtractPoint, type Point2D } from "~/utils/geometry";
import type {
  PuzzleFragmentNeighbors,
  PuzzleFragmentShape,
} from "./getPuzzleFragments";

export type FragmentState = {
  islandId: string;
  rotation: number;
  x: number;
  y: number;
};

export type PuzzleState = {
  fragments: Record<string, FragmentState | undefined>;
  islands: Record<string, string[] | undefined>;
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
  const fragments: PuzzleState["fragments"] = {};
  const islands: PuzzleState["islands"] = {};
  const shapes = new Map<string, PuzzleFragmentShape>();

  args.shapes.forEach((shape, index) => {
    const islandId = String(index);
    islands[islandId] = [shape.fragmentId];
    shapes.set(shape.fragmentId, shape);
    fragments[shape.fragmentId] = {
      islandId,
      rotation: 2 * Math.random() * Math.PI,
      x: shape.start.x,
      y: shape.start.y,
    };
  });

  const [state, setState] = createStore<PuzzleState>({ fragments, islands });

  const setSelectedId = (selectedId?: string) => {
    setState("selectedId", selectedId);
  };

  const setRotation = ({ fragmentId, rotation }: SetRotationArgs) => {
    setState("fragments", fragmentId, "rotation", rotation);
  };

  const setPosition = ({ fragmentId, x, y }: SetPositionArgs) => {
    setState("fragments", fragmentId, "x", x);
    setState("fragments", fragmentId, "y", y);
  };

  const addConnection = ({ fragmentId, islandId }: AddConnectionArgs) => {
    const originalIslandId = state.fragments[fragmentId]?.islandId;
    if (!originalIslandId) {
      return;
    }

    const allFragments = state.islands[originalIslandId] || [];
    allFragments.forEach((fragmentId) => {
      setState("fragments", fragmentId, "islandId", islandId);
    });

    setState("islands", originalIslandId, undefined);
    setState("islands", islandId, (current) => [
      ...(current || []),
      ...allFragments,
    ]);
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
  state: { fragments: {}, islands: {} },
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

type FindCloseNeighborArgs = {
  fragment: Omit<FragmentState, "islandId">;
  fragments: PuzzleState["fragments"];
  neighbors: PuzzleFragmentNeighbors;
};

export const findCloseNeighbor = ({
  fragment,
  fragments,
  neighbors,
}: FindCloseNeighborArgs) => {
  return neighbors.find((neighbor) => {
    const neighborState = fragments[neighbor.id];
    if (neighborState) {
      return arePuzzleFragmentsClose({
        correctDistance: neighbor.distance,
        correctShift: neighbor.shift,
        fragment,
        neighbor: neighborState,
      });
    }
  });
};

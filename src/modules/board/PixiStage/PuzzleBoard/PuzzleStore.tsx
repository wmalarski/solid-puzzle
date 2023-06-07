import { createContext, useContext, type Component, type JSX } from "solid-js";
import { createStore } from "solid-js/store";
import { getDistance, subtractPoint, type Point2D } from "~/utils/geometry";
import type { PuzzleFragmentShape } from "./getPuzzleFragments";

export type FragmentState = {
  rotation: number;
  x: number;
  y: number;
};

export type PuzzleState = {
  fragments: Record<string, FragmentState | undefined>;
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

const usePuzzleStore = (args: UsePuzzleStoreArgs) => {
  const fragments: PuzzleState["fragments"] = {};

  args.shapes.forEach((shape) => {
    fragments[shape.fragmentId] = {
      rotation: 2 * Math.random() * Math.PI,
      x: shape.absoluteStart.x,
      y: shape.absoluteStart.y,
    };
  });

  const [state, setState] = createStore<PuzzleState>({ fragments });

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

  return { setPosition, setRotation, setSelectedId, state };
};

const PuzzleStoreContext = createContext<ReturnType<typeof usePuzzleStore>>({
  setPosition: () => void 0,
  setRotation: () => void 0,
  setSelectedId: () => void 0,
  state: { fragments: {} },
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
  fragment: FragmentState;
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

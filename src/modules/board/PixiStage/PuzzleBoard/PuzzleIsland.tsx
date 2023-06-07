import type * as PIXI from "pixi.js";
import { For, createMemo, type Component } from "solid-js";
import { PuzzleFragment } from "./PuzzleFragment";
import { usePuzzleStoreContext } from "./PuzzleStore";
import type { PuzzleFragmentShape } from "./getPuzzleFragments";

type PuzzleIslandProps = {
  islandId: string;
  texture: PIXI.Texture;
};

export const PuzzleIsland: Component<PuzzleIslandProps> = (props) => {
  const store = usePuzzleStoreContext();

  const fragments = createMemo(() => {
    const shapes: PuzzleFragmentShape[] = [];
    store.state.islands[props.islandId]?.forEach((fragmentId) => {
      const shape = store.shapes.get(fragmentId);
      if (shape) {
        shapes.push(shape);
      }
    });
    return shapes;
  });

  return (
    <For each={fragments()}>
      {(shape) => (
        <PuzzleFragment
          islandId={props.islandId}
          shape={shape}
          texture={props.texture}
        />
      )}
    </For>
  );
};

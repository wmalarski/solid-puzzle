import * as PIXI from "pixi.js";
import { For, createMemo, onCleanup, onMount, type Component } from "solid-js";
import { usePixiApp } from "../PixiApp";
import { PuzzleFragment } from "./PuzzleFragment";
import { usePuzzleStoreContext } from "./PuzzleStore";
import type { PuzzleFragmentShape } from "./getPuzzleFragments";

type PuzzleIslandProps = {
  islandId: string;
  texture: PIXI.Texture;
};

export const PuzzleIsland: Component<PuzzleIslandProps> = (props) => {
  const app = usePixiApp();
  const store = usePuzzleStoreContext();

  const island = new PIXI.Container();
  island.eventMode = "static";

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

  onMount(() => {
    app().stage.addChild(island);
  });

  onCleanup(() => {
    app().stage.removeChild(island);
  });

  return (
    <For each={fragments()}>
      {(shape) => (
        <PuzzleFragment
          island={island}
          islandId={props.islandId}
          shape={shape}
          texture={props.texture}
        />
      )}
    </For>
  );
};

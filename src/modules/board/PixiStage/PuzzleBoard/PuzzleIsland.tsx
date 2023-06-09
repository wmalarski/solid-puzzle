import type * as PIXI from "pixi.js";
import { For, Show, createMemo, type Component } from "solid-js";
import { PuzzleFragment } from "./PuzzleFragment";
import { usePuzzleStoreContext, type FragmentState } from "./PuzzleStore";

type PuzzleIslandProps = {
  islandId: string;
  texture: PIXI.Texture;
};

export const PuzzleIsland: Component<PuzzleIslandProps> = (props) => {
  const store = usePuzzleStoreContext();

  const fragments = createMemo(() => {
    const fragmentStates: FragmentState[] = [];
    const fragments = store.state.islands[props.islandId]?.fragments || {};
    Object.values(fragments).forEach((fragment) => {
      if (fragment) {
        fragmentStates.push(fragment);
      }
    });
    return fragmentStates;
  });

  return (
    <For each={fragments()}>
      {(fragment) => (
        <Show when={store.shapes.get(fragment.fragmentId)}>
          {(shape) => (
            <PuzzleFragment
              shape={shape()}
              texture={props.texture}
              fragmentState={fragment}
            />
          )}
        </Show>
      )}
    </For>
  );
};

import * as PIXI from "pixi.js";
import { createMemo, onCleanup, onMount, type Component } from "solid-js";
import { usePuzzleStoreContext } from "./PuzzleStore";
import type { PuzzleFragmentShape } from "./getPuzzleFragments";

type RotationAnchorProps = {
  container: PIXI.Container;
  shape: PuzzleFragmentShape;
};

export const RotationAnchor: Component<RotationAnchorProps> = (props) => {
  const store = usePuzzleStoreContext();

  const graphics = new PIXI.Graphics();
  graphics.tint = "blue";

  const fragmentState = createMemo(() => {
    return store.state.fragments[props.shape.fragmentId];
  });

  onMount(() => {
    const state = fragmentState();

    if (!state) {
      return;
    }

    console.log(state.rotation, state.x, state.y);
    // const x = state?.rotation || 0;

    graphics.beginFill();
    graphics.drawCircle(
      props.shape.center.x + 30,
      props.shape.center.y + 30,
      10
    );
    graphics.endFill();
  });

  onMount(() => {
    props.container.addChild(graphics);
  });

  onCleanup(() => {
    props.container.removeChild(graphics);
    graphics.destroy();
  });

  return null;
};

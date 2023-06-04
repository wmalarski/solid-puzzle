import * as PIXI from "pixi.js";
import {
  Show,
  createEffect,
  createMemo,
  onCleanup,
  onMount,
  type Component,
} from "solid-js";
import { randomHexColor } from "~/utils/colors";
import { usePixiApp } from "../PixiApp";
import { usePuzzleStoreContext, type FragmentState } from "./PuzzleStore";
import { RotationAnchor } from "./RotationAnchor";
import type { PuzzleFragmentShape } from "./getPuzzleFragments";
import { useDragObject } from "./useDragObject";

type PuzzleFragmentGraphicsProps = {
  container: PIXI.Container;
  fragmentState: FragmentState;
  isSelected: boolean;
  shape: PuzzleFragmentShape;
  texture: PIXI.Texture;
};

export const PuzzleFragmentGraphics: Component<PuzzleFragmentGraphicsProps> = (
  props
) => {
  const wrapper = new PIXI.Container();
  const graphics = new PIXI.Graphics();
  // wrapper.addChild();

  createEffect(() => {
    // container.rotation = props.fragmentState.rotation;
    console.log("props.fragmentState.rotation", props.fragmentState.rotation);
    wrapper.rotation = props.fragmentState.rotation;
  });

  onMount(() => {
    graphics.transform.position.set(
      -props.shape.center.x,
      -props.shape.center.y
    );
    // graphics.x = -props.shape.center.x;
    // graphics.y = -props.shape.center.y;
  });

  onMount(() => {
    const matrix = new PIXI.Matrix(1, 0, 0, 1);
    matrix.translate(-props.shape.min.x, -props.shape.min.y);

    graphics.beginTextureFill({ matrix, texture: props.texture });
    graphics.lineStyle(4, randomHexColor(), 1);

    graphics.moveTo(props.shape.start.x, props.shape.start.y);
    props.shape.curvePoints.forEach(({ control, to }) => {
      graphics.quadraticCurveTo(control.x, control.y, to.x, to.y);
    });

    graphics.endFill();
  });

  onMount(() => {
    props.container.addChild(wrapper);
    wrapper.addChild(graphics);
  });

  onCleanup(() => {
    wrapper.removeChild(graphics);
    props.container.removeChild(wrapper);
    graphics.destroy();
  });

  createEffect(() => {
    graphics.tint = props.isSelected ? "red" : "white";
  });

  return null;
};

type FragmentProps = {
  fragmentState: FragmentState;
  shape: PuzzleFragmentShape;
  texture: PIXI.Texture;
};

const Fragment: Component<FragmentProps> = (props) => {
  const store = usePuzzleStoreContext();
  const app = usePixiApp();

  const container = new PIXI.Container();
  container.eventMode = "static";

  useDragObject({
    displayObject: container,
    onDragStart: () => {
      store.setSelectedId(props.shape.fragmentId);
    },
  });

  onMount(() => {
    container.x = props.shape.min.x;
    container.y = props.shape.min.y;
  });

  onMount(() => {
    app().stage.addChild(container);
  });

  onCleanup(() => {
    app().stage.removeChild(container);
  });

  const isSelected = createMemo(() => {
    return store.state.selectedId === props.shape.fragmentId;
  });

  createEffect(() => {
    container.zIndex = isSelected() ? 1 : 0;
  });

  return (
    <>
      <PuzzleFragmentGraphics
        container={container}
        fragmentState={props.fragmentState}
        isSelected={isSelected()}
        shape={props.shape}
        texture={props.texture}
      />
      <Show when={isSelected()}>
        <RotationAnchor
          container={container}
          fragmentState={props.fragmentState}
          shape={props.shape}
        />
      </Show>
    </>
  );
};

type PuzzleFragmentProps = {
  shape: PuzzleFragmentShape;
  texture: PIXI.Texture;
};

export const PuzzleFragment: Component<PuzzleFragmentProps> = (props) => {
  const store = usePuzzleStoreContext();

  const fragmentState = createMemo(() => {
    return store.state.fragments[props.shape.fragmentId];
  });

  return (
    <Show when={fragmentState()}>
      {(state) => (
        <Fragment
          shape={props.shape}
          fragmentState={state()}
          texture={props.texture}
        />
      )}
    </Show>
  );
};
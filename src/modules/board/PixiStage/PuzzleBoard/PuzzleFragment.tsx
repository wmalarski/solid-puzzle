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
import {
  findCloseNeighbor,
  usePuzzleStoreContext,
  type FragmentState,
} from "./PuzzleStore";
import { RotationAnchor } from "./RotationAnchor";
import type { PuzzleFragmentShape } from "./getPuzzleFragments";
import { useDragObject } from "./useDragObject";

type PuzzleFragmentLabelProps = {
  container: PIXI.Container;
  islandId: string;
};

export const PuzzleFragmentLabel: Component<PuzzleFragmentLabelProps> = (
  props
) => {
  const text = new PIXI.Text();

  createEffect(() => {
    text.text = props.islandId;
  });

  onMount(() => {
    props.container.addChild(text);
  });

  onCleanup(() => {
    props.container.removeChild(text);
  });

  return null;
};

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

  createEffect(() => {
    wrapper.rotation = props.fragmentState.rotation;
  });

  onMount(() => {
    graphics.position.set(-props.shape.center.x, -props.shape.center.y);
  });

  onMount(() => {
    const matrix = new PIXI.Matrix(1, 0, 0, 1);
    matrix.translate(-props.shape.min.x, -props.shape.min.y);

    graphics.beginTextureFill({ matrix, texture: props.texture });
    graphics.lineStyle(4, randomHexColor(), 1);

    const elements = props.shape.curvePoints;
    const last = elements[elements.length - 1];
    graphics.moveTo(last.to.x, last.to.y);
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
  island: PIXI.Container;
  islandId: string;
  shape: PuzzleFragmentShape;
  texture: PIXI.Texture;
};

const Fragment: Component<FragmentProps> = (props) => {
  const store = usePuzzleStoreContext();

  const container = new PIXI.Container();
  container.eventMode = "static";

  useDragObject({
    displayObject: container,
    onDragEnd: () => {
      const fragmentPosition = {
        islandId: props.islandId,
        rotation: props.fragmentState.rotation,
        x: container.x,
        y: container.y,
      };

      store.setPosition({
        fragmentId: props.shape.fragmentId,
        x: fragmentPosition.x,
        y: fragmentPosition.y,
      });

      const toConnect = findCloseNeighbor({
        fragment: fragmentPosition,
        fragments: store.state.fragments,
        neighbors: props.shape.neighbors,
      });

      if (toConnect) {
        store.addConnection({
          fragmentId: toConnect.id,
          islandId: props.islandId,
        });
      }
    },
    onDragStart: () => {
      store.setSelectedId(props.shape.fragmentId);
    },
  });

  onMount(() => {
    container.x = props.fragmentState.x;
  });

  onMount(() => {
    container.y = props.fragmentState.y;
  });

  onMount(() => {
    props.island.addChild(container);
  });

  onCleanup(() => {
    props.island.removeChild(container);
  });

  const isSelected = createMemo(() => {
    return store.state.selectedId === props.shape.fragmentId;
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
          islandId={props.islandId}
          fragmentState={props.fragmentState}
          shape={props.shape}
        />
      </Show>
      <PuzzleFragmentLabel container={container} islandId={props.islandId} />
    </>
  );
};

type PuzzleFragmentProps = {
  island: PIXI.Container;
  islandId: string;
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
          fragmentState={state()}
          island={props.island}
          islandId={props.islandId}
          shape={props.shape}
          texture={props.texture}
        />
      )}
    </Show>
  );
};

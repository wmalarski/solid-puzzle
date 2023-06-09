import * as PIXI from "pixi.js";
import {
  Show,
  createEffect,
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

type PuzzleFragmentLabelProps = {
  container: PIXI.Container;
  label: string;
};

export const PuzzleFragmentLabel: Component<PuzzleFragmentLabelProps> = (
  props
) => {
  const text = new PIXI.Text();

  createEffect(() => {
    text.text = props.label;
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
  shape: PuzzleFragmentShape;
  texture: PIXI.Texture;
};

export const PuzzleFragmentGraphics: Component<PuzzleFragmentGraphicsProps> = (
  props
) => {
  const graphics = new PIXI.Graphics();

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
    graphics.pivot.set(graphics.width / 2, graphics.height / 2);
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

type PuzzleFragmentProps = {
  fragmentState: FragmentState;
  shape: PuzzleFragmentShape;
  texture: PIXI.Texture;
};

export const PuzzleFragment: Component<PuzzleFragmentProps> = (props) => {
  const app = usePixiApp();
  const store = usePuzzleStoreContext();

  const fragmentContainer = new PIXI.Container();
  fragmentContainer.eventMode = "static";

  onMount(() => {
    app().stage.addChild(fragmentContainer);
  });

  onCleanup(() => {
    app().stage.removeChild(fragmentContainer);
  });

  onMount(() => {
    fragmentContainer.x = props.shape.min.x;
    fragmentContainer.y = props.shape.min.y;
  });

  useDragObject({
    displayObject: fragmentContainer,
    onDragEnd: () => {
      // console.log({ island });
      // const fragmentPosition = {
      //   islandId: props.islandId,
      //   rotation: props.fragmentState.rotation,
      //   x: container.x,
      //   y: container.y,
      // };
      // store.setPosition({
      //   fragmentId: props.shape.fragmentId,
      //   x: fragmentPosition.x,
      //   y: fragmentPosition.y,
      // });
      // const toConnect = findCloseNeighbor({
      //   fragment: fragmentPosition,
      //   fragments: store.state.fragments,
      //   neighbors: props.shape.neighbors,
      // });
      // if (toConnect) {
      //   store.addConnection({
      //     fragmentId: toConnect.id,
      //     islandId: props.islandId,
      //   });
      // }
    },
    onDragStart: () => {
      store.setSelectedId(props.shape.fragmentId);
    },
  });

  const onRotationEnd = (rotation: number) => {
    store.setRotation({ fragmentId: props.shape.fragmentId, rotation });
    // console.log({ island });
    // const fragmentPosition = {
    //   islandId: props.islandId,
    //   rotation: Math.atan2(-local.x, local.y),
    //   x: props.container.x,
    //   y: props.container.y,
    // };

    // const toConnect = findCloseNeighbor({
    //   fragment: fragmentPosition,
    //   fragments: store.state.fragments,
    //   neighbors: props.shape.neighbors,
    // });

    // if (toConnect) {
    //   store.addConnection({
    //     fragmentId: toConnect.id,
    //     islandId: props.islandId,
    //   });
    // }
  };

  const onRotationMove = (rotation: number) => {
    store.setRotation({ fragmentId: props.shape.fragmentId, rotation });
  };

  return (
    <>
      <PuzzleFragmentGraphics
        container={fragmentContainer}
        fragmentState={props.fragmentState}
        shape={props.shape}
        texture={props.texture}
      />
      <PuzzleFragmentLabel
        container={fragmentContainer}
        label={props.shape.fragmentId}
      />
      <Show when={store.state.selectedId === props.shape.fragmentId}>
        <RotationAnchor
          container={fragmentContainer}
          rotation={props.fragmentState.rotation}
          onEnd={onRotationEnd}
          onRotate={onRotationMove}
        />
      </Show>
    </>
  );
};

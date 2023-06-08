import * as PIXI from "pixi.js";
import {
  For,
  Show,
  createEffect,
  createMemo,
  onCleanup,
  onMount,
  type Component,
} from "solid-js";
import { usePixiApp } from "../PixiApp";
import { PuzzleFragment } from "./PuzzleFragment";
import { usePuzzleStoreContext } from "./PuzzleStore";
import { RotationAnchor } from "./RotationAnchor";
import type { PuzzleFragmentShape } from "./getPuzzleFragments";
import { useDragObject } from "./useDragObject";

type FragmentsProps = {
  islandId: string;
  wrapper: PIXI.Container;
  texture: PIXI.Texture;
  rotation: number;
};

export const Fragments: Component<FragmentsProps> = (props) => {
  const store = usePuzzleStoreContext();

  const container = new PIXI.Container();
  container.eventMode = "static";

  const fragments = createMemo(() => {
    const shapes: PuzzleFragmentShape[] = [];
    store.state.islands[props.islandId]?.fragments?.forEach((fragmentId) => {
      const shape = store.shapes.get(fragmentId);
      if (shape) {
        shapes.push(shape);
      }
    });
    return shapes;
  });

  onMount(() => {
    props.wrapper.addChild(container);
  });

  onCleanup(() => {
    props.wrapper.removeChild(container);
  });

  createEffect(() => {
    container.rotation = props.rotation;
  });

  return (
    <For each={fragments()}>
      {(shape) => (
        <PuzzleFragment
          island={container}
          islandId={props.islandId}
          shape={shape}
          texture={props.texture}
        />
      )}
    </For>
  );
};

type PuzzleIslandProps = {
  islandId: string;
  texture: PIXI.Texture;
};

export const PuzzleIsland: Component<PuzzleIslandProps> = (props) => {
  const app = usePixiApp();
  const store = usePuzzleStoreContext();

  const wrapper = new PIXI.Container();
  wrapper.eventMode = "static";

  onMount(() => {
    app().stage.addChild(wrapper);
  });

  onCleanup(() => {
    app().stage.removeChild(wrapper);
  });

  useDragObject({
    displayObject: wrapper,
    onDragEnd: () => {
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
      store.setSelectedId(props.islandId);
    },
  });

  const isSelected = createMemo(() => {
    return store.state.selectedId === props.islandId;
  });

  const islandState = createMemo(() => {
    return store.state.islands[props.islandId];
  });

  const rotation = createMemo(() => {
    return (islandState()?.rotation || 0) - Math.PI / 4;
  });

  const onRotationEnd = (rotation: number) => {
    store.setRotation({ islandId: props.islandId, rotation });
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
    store.setRotation({ islandId: props.islandId, rotation });
    // store.setRotation({
    //   islandId: props.islandId,
    //   rotation: Math.atan2(local.x, local.y),
    // });
  };

  return (
    <>
      <Show when={isSelected()}>
        <RotationAnchor
          container={wrapper}
          rotation={rotation()}
          onEnd={onRotationEnd}
          onRotate={onRotationMove}
        />
      </Show>
      <Fragments
        islandId={props.islandId}
        rotation={rotation()}
        texture={props.texture}
        wrapper={wrapper}
      />
    </>
  );
};

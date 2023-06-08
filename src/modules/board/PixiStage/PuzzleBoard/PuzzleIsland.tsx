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
import {
  usePuzzleStoreContext,
  type FragmentState,
  type IslandState,
} from "./PuzzleStore";
import { RotationAnchor } from "./RotationAnchor";
import { useDragObject } from "./useDragObject";

type FragmentsProps = {
  fragments: FragmentState[];
  islandId: string;
  island: PIXI.Container;
  texture: PIXI.Texture;
  rotation: number;
};

export const Fragments: Component<FragmentsProps> = (props) => {
  const store = usePuzzleStoreContext();

  const container = new PIXI.Container();
  container.eventMode = "static";

  onMount(() => {
    props.island.addChild(container);
  });

  onCleanup(() => {
    props.island.removeChild(container);
  });

  createEffect(() => {
    container.rotation = props.rotation;
  });

  return (
    <For each={props.fragments}>
      {(fragment) => (
        <Show when={store.shapes.get(fragment.fragmentId)}>
          {(shape) => (
            <PuzzleFragment
              island={container}
              islandId={props.islandId}
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

type IslandProps = {
  islandId: string;
  islandState: IslandState;
  texture: PIXI.Texture;
};

const Island: Component<IslandProps> = (props) => {
  const app = usePixiApp();
  const store = usePuzzleStoreContext();

  const island = new PIXI.Container();
  island.eventMode = "static";

  onMount(() => {
    // island.pivot.
    app().stage.addChild(island);
  });

  onCleanup(() => {
    app().stage.removeChild(island);
  });

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

  const isSelected = createMemo(() => {
    return store.state.selectedId === props.islandId;
  });

  const rotation = createMemo(() => {
    return props.islandState.rotation;
  });

  useDragObject({
    displayObject: island,
    onDragEnd: () => {
      console.log({ island });
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

  const onRotationEnd = (rotation: number) => {
    store.setRotation({ islandId: props.islandId, rotation });
    console.log({ island });
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
  };

  return (
    <>
      <Show when={isSelected()}>
        <RotationAnchor
          container={island}
          rotation={rotation()}
          onEnd={onRotationEnd}
          onRotate={onRotationMove}
        />
      </Show>
      <Fragments
        fragments={fragments()}
        island={island}
        islandId={props.islandId}
        rotation={rotation()}
        texture={props.texture}
      />
    </>
  );
};

type PuzzleIslandProps = {
  islandId: string;
  texture: PIXI.Texture;
};

export const PuzzleIsland: Component<PuzzleIslandProps> = (props) => {
  const store = usePuzzleStoreContext();

  const islandState = createMemo(() => {
    return store.state.islands[props.islandId];
  });

  return (
    <Show when={islandState()}>
      {(state) => (
        <Island
          islandId={props.islandId}
          islandState={state()}
          texture={props.texture}
        />
      )}
    </Show>
  );
};

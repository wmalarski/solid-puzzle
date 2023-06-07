import * as PIXI from "pixi.js";
import {
  For,
  Show,
  createMemo,
  createResource,
  onCleanup,
  onMount,
  type Component,
} from "solid-js";
import { usePixiApp } from "../PixiApp";
import { PuzzleIsland } from "./PuzzleIsland";
import { PuzzleStoreProvider, usePuzzleStoreContext } from "./PuzzleStore";
import { getPuzzleFragments } from "./getPuzzleFragments";

type UseStageDeselectArgs = {
  onDeselect: () => void;
};

const useStageDeselect = (args: UseStageDeselectArgs) => {
  const app = usePixiApp();

  const onPointerDown = (event: PIXI.FederatedPointerEvent) => {
    if (event.target === app().stage && event.button !== 2) {
      args.onDeselect();
    }
  };

  onMount(() => {
    app().stage.on("pointerdown", onPointerDown);
  });

  onCleanup(() => {
    app().stage.off("pointerdown", onPointerDown);
  });
};

type BoardProps = {
  texture: PIXI.Texture;
};

const Board: Component<BoardProps> = (props) => {
  const store = usePuzzleStoreContext();

  useStageDeselect({
    onDeselect: () => {
      store.setSelectedId();
    },
  });

  return (
    <For each={Object.keys(store.state.islands)}>
      {(islandId) => (
        <PuzzleIsland islandId={islandId} texture={props.texture} />
      )}
    </For>
  );
};

type ProviderProps = {
  texture: PIXI.Texture;
};

const Provider: Component<ProviderProps> = (props) => {
  const shapes = createMemo(() => {
    return getPuzzleFragments({
      columns: 8,
      height: props.texture.height,
      rows: 5,
      width: props.texture.width,
    });
  });

  return (
    <PuzzleStoreProvider shapes={shapes()}>
      <Board texture={props.texture} />
    </PuzzleStoreProvider>
  );
};

type Props = {
  path: string;
};

export const PuzzleBoard: Component<Props> = (props) => {
  const [texture] = createResource(async () => {
    const asset = await PIXI.Assets.load(props.path);
    return asset as PIXI.Texture;
  });

  return (
    <Show when={texture()}>
      {(texture) => <Provider texture={texture()} />}
    </Show>
  );
};

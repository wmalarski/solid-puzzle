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
import type { BoardModel } from "~/db/types";
import { getPuzzleFragments } from "~/utils/getPuzzleFragments";
import { usePixiApp } from "../PixiApp";
import { PreviewGrid, PreviewSprite } from "./PreviewSprite";
import { PuzzleFragment } from "./PuzzleFragment";
import { PuzzleStoreProvider, usePuzzleStoreContext } from "./PuzzleStore";

type UseStageDeselectArgs = {
  onDeselect: VoidFunction;
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
    <For each={store.shapes}>
      {(shape) => (
        <PuzzleFragment
          texture={props.texture}
          state={fragment()}
          shape={shape}
        />
      )}
    </For>
  );
};

type ProviderProps = {
  board: BoardModel;
  texture: PIXI.Texture;
};

const Provider: Component<ProviderProps> = (props) => {
  const shapes = createMemo(() => {
    const config = JSON.parse(props.board.config);

    return getPuzzleFragments({
      config,
      height: props.texture.height,
      width: props.texture.width,
    });
  });

  return (
    <PuzzleStoreProvider boardId={props.board.id} shapes={shapes().fragments}>
      <PreviewSprite texture={props.texture} />
      <PreviewGrid lines={shapes().lines} />
      <Board texture={props.texture} />
    </PuzzleStoreProvider>
  );
};

type Props = {
  board: BoardModel;
  path: string;
};

export const PuzzleBoard: Component<Props> = (props) => {
  const [texture] = createResource(async () => {
    const asset = await PIXI.Assets.load(props.path);
    return asset as PIXI.Texture;
  });

  return (
    <Show when={texture()}>
      {(texture) => <Provider board={props.board} texture={texture()} />}
    </Show>
  );
};

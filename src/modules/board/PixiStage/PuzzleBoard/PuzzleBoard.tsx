import { Assets, type FederatedPointerEvent, type Texture } from "pixi.js";
import {
  type Component,
  For,
  Show,
  createEffect,
  createResource,
  onCleanup,
  onMount,
} from "solid-js";

import type { BoardModel } from "~/server/board/types";

import { usePuzzleStore } from "../../DataProviders/PuzzleProvider";
import { usePlayerSelection } from "../../DataProviders/SelectionProvider";
import { usePixiApp } from "../PixiApp";
import { RIGHT_BUTTON } from "../constants";
import { PreviewGrid, PreviewSprite } from "./PreviewSprite";
import { PuzzleFragment } from "./PuzzleFragment";
import { RemoteCursors } from "./RemoteCursors";

const useStageDeselect = () => {
  const app = usePixiApp();
  const selection = usePlayerSelection();

  const onPointerDown = (event: FederatedPointerEvent) => {
    if (event.target === app.stage && event.button !== RIGHT_BUTTON) {
      selection.select(null);
    }
  };

  onMount(() => {
    app.stage.on("pointerdown", onPointerDown);
  });

  onCleanup(() => {
    app.stage.off("pointerdown", onPointerDown);
  });
};

type BoardProps = {
  texture: Texture;
};

const Board: Component<BoardProps> = (props) => {
  const store = usePuzzleStore();

  useStageDeselect();

  return (
    <For each={store.config().fragments}>
      {(shape) => <PuzzleFragment shape={shape} texture={props.texture} />}
    </For>
  );
};

type ProviderProps = {
  board: BoardModel;
  texture: Texture;
};

const Provider: Component<ProviderProps> = (props) => {
  const store = usePuzzleStore();

  createEffect(() => {
    store.initFragments({
      board: props.board,
      height: props.texture.height,
      width: props.texture.width,
    });
  });

  return (
    <>
      <PreviewSprite texture={props.texture} />
      <PreviewGrid lines={store.config().lines} />
      <Board texture={props.texture} />
      <RemoteCursors />
    </>
  );
};

type Props = {
  board: BoardModel;
  path: string;
};

export const PuzzleBoard: Component<Props> = (props) => {
  const [texture] = createResource(async () => {
    const asset = await Assets.load(props.path);

    return asset as Texture;
  });

  return (
    <Show when={texture()}>
      {(texture) => <Provider board={props.board} texture={texture()} />}
    </Show>
  );
};

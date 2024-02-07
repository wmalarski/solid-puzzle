import { Assets, type FederatedPointerEvent, type Texture } from "pixi.js";
import {
  type Component,
  For,
  Show,
  createResource,
  onCleanup,
  onMount
} from "solid-js";

import type { BoardModel } from "~/types/models";

import { usePuzzleStore } from "../../DataProviders/PuzzleProvider";
import { usePlayerSelection } from "../../DataProviders/SelectionProvider";
import { usePixiContainer } from "../PixiApp";
import { RIGHT_BUTTON } from "../constants";
import { PreviewGrid, PreviewSprite } from "./PreviewSprite";
import { PuzzleFragment } from "./PuzzleFragment";
import { RemoteCursors } from "./RemoteCursors";

const useStageDeselect = () => {
  const container = usePixiContainer();
  const selection = usePlayerSelection();

  const onPointerDown = (event: FederatedPointerEvent) => {
    if (event.target === container && event.button !== RIGHT_BUTTON) {
      selection.select(null);
    }
  };

  onMount(() => {
    container.on("pointerdown", onPointerDown);
  });

  onCleanup(() => {
    container.off("pointerdown", onPointerDown);
  });
};

type BoardProps = {
  texture: Texture;
};

const Board: Component<BoardProps> = (props) => {
  const store = usePuzzleStore();

  useStageDeselect();

  return (
    <For each={store.fragmentsIds()}>
      {(fragmentId) => (
        <Show when={store.shapes().get(fragmentId)}>
          {(shape) => (
            <Show when={store.fragments()[fragmentId]}>
              {(state) => (
                <PuzzleFragment
                  shape={shape()}
                  state={state()}
                  texture={props.texture}
                />
              )}
            </Show>
          )}
        </Show>
      )}
    </For>
  );
};

type ProviderProps = {
  board: BoardModel;
  texture: Texture;
};

const Provider: Component<ProviderProps> = (props) => {
  const store = usePuzzleStore();

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

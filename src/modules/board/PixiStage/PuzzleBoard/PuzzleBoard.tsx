import { createAsync } from "@solidjs/router";
import { Assets, type FederatedPointerEvent, type Texture } from "pixi.js";
import { For, onCleanup, onMount, Show } from "solid-js";

import type { BoardModel } from "~/types/models";

import { usePuzzleStore } from "../../DataProviders/PuzzleProvider";
import { usePlayerSelection } from "../../DataProviders/SelectionProvider";
import { RIGHT_BUTTON } from "../constants";
import { usePixiContainer } from "../PixiApp";
import { usePreventMenu } from "../usePreventMenu";
import { useStageTransform } from "../useStageTransform";
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

function Board(props: BoardProps) {
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
}

type PuzzleBoardProps = {
  board: BoardModel;
  path: string;
};

export function PuzzleBoard(props: PuzzleBoardProps) {
  const store = usePuzzleStore();

  useStageTransform();
  usePreventMenu();

  const texture = createAsync(async () => {
    const asset = await Assets.load(props.path);
    return asset as Texture;
  });

  return (
    <Show when={texture()}>
      {(texture) => (
        <>
          <PreviewSprite texture={texture()} />
          <PreviewGrid lines={store.config().lines} />
          <Board texture={texture()} />
          <RemoteCursors />
        </>
      )}
    </Show>
  );
}

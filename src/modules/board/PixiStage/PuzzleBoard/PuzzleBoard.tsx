import * as PIXI from "pixi.js";
import {
  For,
  Show,
  createEffect,
  createResource,
  onCleanup,
  onMount,
  type Component,
} from "solid-js";
import type { BoardModel } from "~/server/board/types";
import { usePlayerPresence } from "../../DataProviders/PresenceProvider";
import { usePuzzleStore } from "../../DataProviders/PuzzleProvider";
import { usePixiApp } from "../PixiApp";
import { PreviewGrid, PreviewSprite } from "./PreviewSprite";
import { PuzzleFragment } from "./PuzzleFragment";

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
  const store = usePuzzleStore();
  const presence = usePlayerPresence();

  useStageDeselect({
    onDeselect: () => {
      presence.setPlayerSelection(null);
    },
  });

  return (
    <For each={store.config().fragments}>
      {(shape) => <PuzzleFragment texture={props.texture} shape={shape} />}
    </For>
  );
};

type ProviderProps = {
  board: BoardModel;
  texture: PIXI.Texture;
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
    </>
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

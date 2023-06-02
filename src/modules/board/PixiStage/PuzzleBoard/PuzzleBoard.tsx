import * as PIXI from "pixi.js";
import {
  For,
  Show,
  createMemo,
  createResource,
  createSignal,
  onCleanup,
  onMount,
  type Component,
} from "solid-js";
import { usePixiApp } from "../PixiApp";
import { PuzzleFragment } from "./PuzzleFragment";
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
  const [selectedId, setSelectedId] = createSignal<string>();

  useStageDeselect({
    onDeselect: () => {
      setSelectedId();
    },
  });

  const shapes = createMemo(() => {
    return getPuzzleFragments({
      columns: 8,
      height: props.texture.height,
      rows: 5,
      width: props.texture.width,
    });
  });

  const onSelect = (fragmentId: string) => {
    setSelectedId(fragmentId);
  };

  return (
    <For each={shapes()}>
      {(shape) => (
        <PuzzleFragment
          onSelect={onSelect}
          selectedId={selectedId()}
          shape={shape}
          texture={props.texture}
        />
      )}
    </For>
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
    <Show when={texture()}>{(texture) => <Board texture={texture()} />}</Show>
  );
};

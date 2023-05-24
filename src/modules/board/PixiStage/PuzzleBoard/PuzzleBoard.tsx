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
import { PuzzleFragment } from "./PuzzleFragment";
import { generatePuzzleFragments } from "./generatePuzzleFragments";

type BoardProps = {
  sprite: PIXI.Sprite;
};

const Board: Component<BoardProps> = (props) => {
  const app = usePixiApp();

  const shapes = createMemo(() => {
    return generatePuzzleFragments({
      columns: 8,
      height: props.sprite.height,
      rows: 5,
      width: props.sprite.width,
    });
  });

  onMount(() => {
    props.sprite.tint = "#aa00ff";
    app().stage.addChildAt(props.sprite, 0);
  });
  onCleanup(() => {
    app().stage.removeChild(props.sprite);
  });

  return (
    <For each={shapes()}>
      {(shape) => <PuzzleFragment shape={shape} sprite={props.sprite} />}
    </For>
  );
};

type Props = {
  path: string;
};

export const PuzzleBoard: Component<Props> = (props) => {
  const [resource] = createResource(async () => {
    const asset = await PIXI.Assets.load(props.path);
    return new PIXI.Sprite(asset);
  });

  return (
    <Show when={resource()}>{(sprite) => <Board sprite={sprite()} />}</Show>
  );
};

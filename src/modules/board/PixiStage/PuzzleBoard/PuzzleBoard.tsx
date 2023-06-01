import * as PIXI from "pixi.js";
import {
  For,
  Show,
  createMemo,
  createResource,
  type Component,
} from "solid-js";
import { PuzzleFragment } from "./PuzzleFragment";
import { generatePuzzleFragments } from "./generatePuzzleFragments";

type BoardProps = {
  texture: PIXI.Texture;
};

const Board: Component<BoardProps> = (props) => {
  const shapes = createMemo(() => {
    return generatePuzzleFragments({
      columns: 8,
      height: props.texture.height,
      rows: 5,
      width: props.texture.width,
    });
  });

  return (
    <For each={shapes()}>
      {(shape) => <PuzzleFragment shape={shape} texture={props.texture} />}
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
    // return new PIXI.Sprite(asset);
  });

  return (
    <Show when={texture()}>{(texture) => <Board texture={texture()} />}</Show>
  );
};

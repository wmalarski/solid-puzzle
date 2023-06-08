import * as PIXI from "pixi.js";
import { createEffect, onCleanup, onMount, type Component } from "solid-js";
import { randomHexColor } from "~/utils/colors";
import { type FragmentState } from "./PuzzleStore";
import type { PuzzleFragmentShape } from "./getPuzzleFragments";

type PuzzleFragmentLabelProps = {
  container: PIXI.Container;
  islandId: string;
};

export const PuzzleFragmentLabel: Component<PuzzleFragmentLabelProps> = (
  props
) => {
  const text = new PIXI.Text();

  createEffect(() => {
    text.text = props.islandId;
  });

  onMount(() => {
    props.container.addChild(text);
  });

  onCleanup(() => {
    props.container.removeChild(text);
  });

  return null;
};

type PuzzleFragmentGraphicsProps = {
  container: PIXI.Container;
  fragmentState: FragmentState;
  shape: PuzzleFragmentShape;
  texture: PIXI.Texture;
};

export const PuzzleFragmentGraphics: Component<PuzzleFragmentGraphicsProps> = (
  props
) => {
  const graphics = new PIXI.Graphics();

  onMount(() => {
    const matrix = new PIXI.Matrix(1, 0, 0, 1);
    matrix.translate(-props.shape.min.x, -props.shape.min.y);

    graphics.beginTextureFill({ matrix, texture: props.texture });
    graphics.lineStyle(4, randomHexColor(), 1);

    const elements = props.shape.curvePoints;
    const last = elements[elements.length - 1];
    graphics.moveTo(last.to.x, last.to.y);
    props.shape.curvePoints.forEach(({ control, to }) => {
      graphics.quadraticCurveTo(control.x, control.y, to.x, to.y);
    });

    graphics.endFill();
    graphics.pivot.set(graphics.width / 2, graphics.height / 2);
  });

  onMount(() => {
    props.container.addChild(graphics);
  });

  onCleanup(() => {
    props.container.removeChild(graphics);
    graphics.destroy();
  });

  return null;
};

type PuzzleFragmentProps = {
  fragmentState: FragmentState;
  island: PIXI.Container;
  islandId: string;
  shape: PuzzleFragmentShape;
  texture: PIXI.Texture;
};

export const PuzzleFragment: Component<PuzzleFragmentProps> = (props) => {
  const container = new PIXI.Container();
  container.eventMode = "static";

  onMount(() => {
    container.x = props.shape.min.x;
    container.y = props.shape.min.y;
  });

  onMount(() => {
    props.island.addChild(container);
  });

  onCleanup(() => {
    props.island.removeChild(container);
  });

  return (
    <>
      <PuzzleFragmentGraphics
        container={container}
        fragmentState={props.fragmentState}
        shape={props.shape}
        texture={props.texture}
      />
      <PuzzleFragmentLabel container={container} islandId={props.islandId} />
    </>
  );
};

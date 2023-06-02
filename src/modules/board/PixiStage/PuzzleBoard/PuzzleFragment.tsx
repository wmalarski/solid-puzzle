import * as PIXI from "pixi.js";
import { createEffect, onCleanup, onMount, type Component } from "solid-js";
import { randomHexColor } from "~/utils/colors";
import { usePixiApp } from "../PixiApp";
import type { PuzzleFragmentShape } from "./generatePuzzleFragments";
import { useDragObject } from "./useDragObject";

type Props = {
  texture: PIXI.Texture;
  shape: PuzzleFragmentShape;
};

export const PuzzleFragment: Component<Props> = (props) => {
  const app = usePixiApp();

  const container = new PIXI.Container();
  container.eventMode = "static";
  useDragObject({ displayObject: container });

  onMount(() => {
    app().stage.addChild(container);
  });
  onCleanup(() => {
    app().stage.removeChild(container);
  });

  createEffect(() => {
    const graphics = new PIXI.Graphics();

    graphics.beginTextureFill({
      matrix: new PIXI.Matrix(1, 0, 0, 1),
      texture: props.texture,
    });
    graphics.lineStyle(4, randomHexColor(), 1);
    graphics.moveTo(props.shape.start.x, props.shape.start.y);

    props.shape.curvePoints.forEach(({ control, to }) => {
      graphics.quadraticCurveTo(control.x, control.y, to.x, to.y);
    });

    graphics.endFill();

    onMount(() => {
      container.addChild(graphics);
    });

    onCleanup(() => {
      container.removeChild(graphics);
      graphics.destroy();
    });
  });

  return null;
};

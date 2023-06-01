import * as PIXI from "pixi.js";
import { createEffect, onCleanup, onMount, type Component } from "solid-js";
import { randomHexColor } from "~/utils/colors";
import { usePixiApp } from "../PixiApp";
import type { PuzzleFragmentShape } from "./generatePuzzleFragments";

type Props = {
  texture: PIXI.Texture;
  shape: PuzzleFragmentShape;
};

export const PuzzleFragment: Component<Props> = (props) => {
  const app = usePixiApp();

  createEffect(() => {
    const graphics = new PIXI.Graphics();

    graphics.beginTextureFill({ texture: props.texture });
    graphics.lineStyle(4, randomHexColor(), 1);
    graphics.moveTo(props.shape.start.x, props.shape.start.y);

    props.shape.curvePoints.forEach(({ control, to }) => {
      graphics.quadraticCurveTo(control.x, control.y, to.x, to.y);
    });

    graphics.endFill();

    onMount(() => {
      app().stage.addChild(graphics);
    });

    onCleanup(() => {
      app().stage.removeChild(graphics);
      graphics.destroy();
    });
  });

  return null;
};

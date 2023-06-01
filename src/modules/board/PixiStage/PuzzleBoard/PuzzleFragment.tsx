import * as PIXI from "pixi.js";
import { createEffect, onCleanup, onMount, type Component } from "solid-js";
import { usePixiApp } from "../PixiApp";
import type { PuzzleFragmentShape } from "./generatePuzzleFragments";

type Props = {
  texture: PIXI.Texture;
  shape: PuzzleFragmentShape;
};

export const PuzzleFragment: Component<Props> = (props) => {
  const app = usePixiApp();

  createEffect(() => {
    // const sprite = new PIXI.Sprite(props.texture);
    // sprite.tint = "#ccddaa";

    const mask = new PIXI.Graphics();

    mask.beginTextureFill({
      texture: props.texture,
    });

    // mask.drawCircle(props.shape.left.start.x, props.shape.left.start.y, 5);

    // mask.closePath();

    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    mask.lineStyle(4, `#${randomColor}`.padEnd(9, "0"), 1);
    mask.moveTo(props.shape.left.start.x, props.shape.left.start.y);

    mask.quadraticCurveTo(
      props.shape.left.center.x,
      props.shape.left.center.y,
      props.shape.left.end.x,
      props.shape.left.end.y
    );
    mask.quadraticCurveTo(
      props.shape.bottom.center.x,
      props.shape.bottom.center.y,
      props.shape.bottom.end.x,
      props.shape.bottom.end.y
    );
    mask.quadraticCurveTo(
      props.shape.right.center.x,
      props.shape.right.center.y,
      props.shape.right.end.x,
      props.shape.right.end.y
    );
    mask.quadraticCurveTo(
      props.shape.top.center.x,
      props.shape.top.center.y,
      props.shape.top.end.x,
      props.shape.top.end.y
    );

    mask.closePath();
    mask.endFill();

    onMount(() => {
      // app().stage.addChild(sprite);
      app().stage.addChild(mask);
    });
    onCleanup(() => {
      // app().stage.removeChild(sprite);
      app().stage.removeChild(mask);
      mask.destroy();
    });
  });

  return null;
};

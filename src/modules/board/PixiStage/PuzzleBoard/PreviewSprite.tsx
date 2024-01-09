import { Graphics, Sprite, type Texture } from "pixi.js";
import { createEffect, onCleanup, onMount, type Component } from "solid-js";
import type { PuzzleShapeLine } from "~/utils/getPuzzleFragments";
import { usePixiApp } from "../PixiApp";
import { PREVIEW_STROKE_COLOR } from "../constants";

type PreviewGridProps = {
  lines: PuzzleShapeLine[];
};

export const PreviewGrid: Component<PreviewGridProps> = (props) => {
  const app = usePixiApp();

  const graphics = new Graphics();

  createEffect(() => {
    props.lines.forEach((line) => {
      graphics
        .moveTo(line.start.x, line.start.y)
        .quadraticCurveTo(line.center.x, line.center.y, line.end.x, line.end.y)
        .stroke({ color: PREVIEW_STROKE_COLOR, width: 1 });
    });
  });

  onMount(() => {
    app.stage.addChild(graphics);
  });

  onCleanup(() => {
    app.stage.removeChild(graphics);
  });

  return null;
};

type PreviewSpriteProps = {
  texture: Texture;
};

export const PreviewSprite: Component<PreviewSpriteProps> = (props) => {
  const app = usePixiApp();

  const sprite = new Sprite();
  sprite.alpha = 0.2;

  createEffect(() => {
    sprite.texture = props.texture;
  });

  onMount(() => {
    app.stage.addChild(sprite);
  });

  onCleanup(() => {
    app.stage.removeChild(sprite);
  });

  return null;
};

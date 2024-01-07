import { Graphics, Sprite, type Texture } from "pixi.js";
import { createEffect, onCleanup, onMount, type Component } from "solid-js";
import type { PuzzleShapeLine } from "~/utils/getPuzzleFragments";
import { usePixiContainer } from "../PixiApp";
import { PREVIEW_STROKE_COLOR } from "../constants";

type PreviewGridProps = {
  lines: PuzzleShapeLine[];
};

export const PreviewGrid: Component<PreviewGridProps> = (props) => {
  const container = usePixiContainer();

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
    container.addChild(graphics);
  });

  onCleanup(() => {
    container.removeChild(graphics);
  });

  return null;
};

type PreviewSpriteProps = {
  texture: Texture;
};

export const PreviewSprite: Component<PreviewSpriteProps> = (props) => {
  const container = usePixiContainer();

  const sprite = new Sprite();
  sprite.alpha = 0.2;

  createEffect(() => {
    sprite.texture = props.texture;
  });

  onMount(() => {
    container.addChild(sprite);
  });

  onCleanup(() => {
    container.removeChild(sprite);
  });

  return null;
};

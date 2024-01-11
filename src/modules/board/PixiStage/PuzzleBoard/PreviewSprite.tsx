import { Graphics, Sprite, type Texture } from "pixi.js";
import { type Component, createEffect, onCleanup, onMount } from "solid-js";

import type { PuzzleShapeLine } from "~/utils/getPuzzleFragments";

import { useBoardTheme } from "../BoardTheme";
import { usePixiApp } from "../PixiApp";

type PreviewGridProps = {
  lines: PuzzleShapeLine[];
};

export const PreviewGrid: Component<PreviewGridProps> = (props) => {
  const app = usePixiApp();
  const theme = useBoardTheme();

  const graphics = new Graphics();

  createEffect(() => {
    props.lines.forEach((line) => {
      graphics
        .moveTo(line.start.x, line.start.y)
        .quadraticCurveTo(line.center.x, line.center.y, line.end.x, line.end.y)
        .stroke({
          color: theme.previewStrokeColor,
          width: theme.previewStrokeWidth,
        });
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
  const theme = useBoardTheme();

  const sprite = new Sprite();
  sprite.alpha = theme.previewSpriteAlpha;

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

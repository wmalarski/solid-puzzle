import {
  type FederatedPointerEvent,
  Graphics,
  Sprite,
  type Texture
} from "pixi.js";
import { createEffect, onCleanup, onMount } from "solid-js";

import type { PuzzleShapeLine } from "~/utils/getPuzzleFragments";

import { usePlayerSelection } from "../../DataProviders/SelectionProvider";
import { usePreviewContext } from "../../PreviewContext";
import { useBoardTheme } from "../BoardTheme";
import { usePixiContainer } from "../PixiApp";

type PreviewGridProps = {
  lines: PuzzleShapeLine[];
};

export function PreviewGrid(props: PreviewGridProps) {
  const container = usePixiContainer();
  const theme = useBoardTheme();

  const graphics = new Graphics();

  createEffect(() => {
    graphics.clear();
    props.lines.forEach((line) => {
      graphics
        .moveTo(line.start.x, line.start.y)
        .quadraticCurveTo(line.center.x, line.center.y, line.end.x, line.end.y)
        .stroke({
          color: theme.previewStrokeColor,
          width: theme.previewStrokeWidth
        });
    });
  });

  onMount(() => {
    container.addChild(graphics);
  });

  onCleanup(() => {
    container.removeChild(graphics);
  });

  return null;
}

type PreviewSpriteProps = {
  texture: Texture;
};

export function PreviewSprite(props: PreviewSpriteProps) {
  const container = usePixiContainer();
  const theme = useBoardTheme();
  const selection = usePlayerSelection();
  const preview = usePreviewContext();

  const sprite = new Sprite();
  sprite.alpha = 0;

  createEffect(() => {
    sprite.texture = props.texture;
  });

  onMount(() => {
    container.addChild(sprite);
  });

  onCleanup(() => {
    container.removeChild(sprite);
  });

  const onPointerDown = (event: FederatedPointerEvent) => {
    if (event.target === sprite) {
      selection().select(null);
    }
    selection().select(null);
  };

  onMount(() => {
    sprite.on("pointerdown", onPointerDown);
  });

  onCleanup(() => {
    sprite.off("pointerdown", onPointerDown);
  });

  createEffect(() => {
    sprite.alpha = preview().isPreviewVisible() ? theme.previewSpriteAlpha : 0;
  });

  return null;
}

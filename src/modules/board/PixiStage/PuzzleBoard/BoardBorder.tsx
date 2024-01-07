import { Graphics, type Container } from "pixi.js";
import { createEffect, onCleanup, onMount, type Component } from "solid-js";
import { useTransformContext } from "../../TransformContext";
import { usePixiApp, usePixiContainer } from "../PixiApp";

type BoardBorderProps = {
  container: Container;
  color: number;
};

export const BoardBorder: Component<BoardBorderProps> = (props) => {
  const app = usePixiApp();

  const graphics = new Graphics();

  createEffect(() => {
    const minX = app.screen.left;
    const maxX = app.screen.right;
    const minY = app.screen.top;
    const maxY = app.screen.bottom;

    graphics
      .moveTo(minX, minY)
      .lineTo(minX, maxY)
      .lineTo(maxX, maxY)
      .lineTo(maxX, minY)
      .stroke({ color: props.color, width: 5 });
  });

  onMount(() => {
    props.container.addChild(graphics);
  });

  onCleanup(() => {
    props.container.removeChild(graphics);
  });

  return null;
};

export const BoardBackground: Component = () => {
  const container = usePixiContainer();
  const transform = useTransformContext();

  const graphics = new Graphics();

  createEffect(() => {
    const minX = 0;
    const maxX = container.width * transform.scale();
    const minY = 0;
    const maxY = container.height * transform.scale();

    console.log({
      transform,
    });

    graphics.rect(minX, minY, maxX, maxY).fill({ color: 0x44aa44 });
  });

  onMount(() => {
    container.addChild(graphics);
  });

  onCleanup(() => {
    container.removeChild(graphics);
  });

  return null;
};

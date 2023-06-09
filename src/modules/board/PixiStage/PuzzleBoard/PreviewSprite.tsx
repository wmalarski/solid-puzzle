import * as PIXI from "pixi.js";
import { onCleanup, onMount, type Component } from "solid-js";
import { usePixiApp } from "../PixiApp";

type PreviewSpriteProps = {
  texture: PIXI.Texture;
};

export const PreviewSprite: Component<PreviewSpriteProps> = (props) => {
  const app = usePixiApp();

  const sprite = new PIXI.Sprite();
  sprite.alpha = 0.5;

  onMount(() => {
    sprite.texture = props.texture;
    app().stage.addChild(sprite);
  });

  onCleanup(() => {
    app().stage.removeChild(sprite);
  });

  return null;
};

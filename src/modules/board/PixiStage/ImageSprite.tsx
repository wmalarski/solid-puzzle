import * as PIXI from "pixi.js";
import {
  createEffect,
  createResource,
  onCleanup,
  type Component,
} from "solid-js";
import { usePixiApp } from "./PixiApp";

type Props = {
  path: string;
};

export const ImageSprite: Component<Props> = (props) => {
  const app = usePixiApp();

  const [resource] = createResource(async () => {
    const asset = await PIXI.Assets.load(props.path);
    return new PIXI.Sprite(asset);
  });

  createEffect(() => {
    const sprite = resource();
    if (sprite) {
      app().stage.addChildAt(sprite, 0);
    }
  });

  onCleanup(() => {
    const sprite = resource();
    if (sprite) {
      app().stage.removeChild(sprite);
    }
  });

  return null;
};

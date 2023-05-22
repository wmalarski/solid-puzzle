import * as PIXI from "pixi.js";
import {
  createEffect,
  createResource,
  onCleanup,
  type Component,
} from "solid-js";
import { usePixiContext } from "./PixiContext";

type Props = {
  path: string;
};

export const ImageSprite: Component<Props> = (props) => {
  const pixi = usePixiContext();

  const [resource] = createResource(async () => {
    const asset = await PIXI.Assets.load(props.path);
    return new PIXI.Sprite(asset);
  });

  createEffect(() => {
    const sprite = resource();
    if (sprite) {
      pixi.app.stage.addChildAt(sprite, 0);
    }
  });

  onCleanup(() => {
    const sprite = resource();
    if (sprite) {
      pixi.app.stage.removeChild(sprite);
    }
  });

  return null;
};

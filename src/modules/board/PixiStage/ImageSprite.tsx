import * as PIXI from "pixi.js";
import {
  createEffect,
  createResource,
  onCleanup,
  onMount,
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

    if (!sprite) {
      return;
    }

    const mask = new PIXI.Graphics();
    mask.beginFill(0x00ff00);
    // mask.drawEllipse(205, 230, 160, 140);

    mask.moveTo(100, 100);
    mask.quadraticCurveTo(125, 150, 100, 200);
    mask.quadraticCurveTo(150, 225, 200, 200);
    mask.quadraticCurveTo(225, 150, 200, 100);
    mask.quadraticCurveTo(150, 75, 100, 100);

    sprite.mask = mask;

    onMount(() => {
      app().stage.addChildAt(sprite, 0);
      app().stage.addChild(mask);
    });
    onCleanup(() => {
      app().stage.removeChild(sprite);
      app().stage.removeChild(mask);
    });
  });

  return null;
};

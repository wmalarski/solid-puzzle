import * as PIXI from "pixi.js";
import {
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  type Component,
} from "solid-js";
import type { Point2D } from "~/utils/geometry";
import { usePixiApp } from "../../../PixiApp";

type Props = {
  container: PIXI.Container;
};

export const Transformer: Component<Props> = (props) => {
  const app = usePixiApp();

  const anchor = new PIXI.Sprite(PIXI.Texture.WHITE);

  anchor.alpha = 0.3;
  // anchor.interactive = true;
  anchor.cursor = "pointer";
  anchor.anchor.set(0.5);
  anchor.width = 10;
  anchor.height = 10;

  onMount(() => {
    props.container.addChild(anchor);
  });
  onCleanup(() => {
    props.container.removeChild(anchor);
  });

  const [start, setStart] = createSignal<Point2D>();

  const onDragMove = () => {
    const startPoint = start();
    if (!startPoint) {
      return;
    }
  };

  const onPointerDown = (event: PIXI.FederatedMouseEvent) => {
    if (event.button === 2) {
      return;
    }

    event.stopPropagation();

    app().stage.on("pointermove", onDragMove);
    setStart({ x: event.x, y: event.y });
  };

  onMount(() => {
    anchor.on("pointerdown", onPointerDown);
  });

  onCleanup(() => {
    anchor.off("pointerdown", onPointerDown);
  });

  createEffect(() => {
    if (!start()) {
      return;
    }

    const onDragEnd = () => {
      app().stage.off("pointermove", onDragMove);
      setStart();
    };

    onMount(() => {
      app().stage.on("pointerup", onDragEnd);
      app().stage.on("pointerupoutside", onDragEnd);
    });

    onCleanup(() => {
      app().stage.off("pointerup", onDragEnd);
      app().stage.off("pointerupoutside", onDragEnd);
    });
  });

  return null;
};

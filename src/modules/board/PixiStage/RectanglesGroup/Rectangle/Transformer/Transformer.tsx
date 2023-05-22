import * as PIXI from "pixi.js";
import {
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  type Component,
} from "solid-js";
import type { Point2D } from "~/utils/geometry";
import { usePixiContext } from "../../../PixiContext";

type Props = {
  container: PIXI.Container;
};

export const Transformer: Component<Props> = (props) => {
  const pixi = usePixiContext();

  const anchor = new PIXI.Sprite(PIXI.Texture.WHITE);

  anchor.alpha = 0.3;
  anchor.interactive = true;
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

    pixi.app.stage.on("pointermove", onDragMove);
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
      pixi.app.stage.off("pointermove", onDragMove);
      setStart();
    };

    onMount(() => {
      pixi.app.stage.on("pointerup", onDragEnd);
      pixi.app.stage.on("pointerupoutside", onDragEnd);
    });

    onCleanup(() => {
      pixi.app.stage.off("pointerup", onDragEnd);
      pixi.app.stage.off("pointerupoutside", onDragEnd);
    });
  });

  return null;
};

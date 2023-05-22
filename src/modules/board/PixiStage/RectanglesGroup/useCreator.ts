import * as PIXI from "pixi.js";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import type { Point2D } from "~/utils/geometry";
import { usePixiContext } from "../PixiContext";

export const useCreator = () => {
  const pixi = usePixiContext();
  // const workspace = useWorkspaceContext();
  // const { setSelectedId } = useSelectedId();

  const [drawTarget, setDrawTarget] = createSignal<PIXI.Sprite>();
  const [startPoint, setStartPoint] = createSignal<Point2D>();

  const onDragMove = (event: PIXI.FederatedPointerEvent) => {
    const target = drawTarget();
    const start = startPoint();
    if (!target || !start) {
      return;
    }

    const transform = pixi.app.stage.transform.worldTransform;
    const inverted = transform.applyInverse(event.global);

    const [x1, x2] = [inverted.x, start.x].sort((a, b) => a - b);
    const [y1, y2] = [inverted.y, start.y].sort((a, b) => a - b);

    target.position.set(x1, y1);
    target.width = x2 - x1;
    target.height = y2 - y1;
  };

  const onPointerDown = (event: PIXI.FederatedPointerEvent) => {
    const transform = pixi.app.stage.transform.worldTransform;
    const inverted = transform.applyInverse(event.global);

    const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    sprite.position.set(inverted.x, inverted.y);
    sprite.width = 0;
    sprite.height = 0;

    pixi.app.stage.addChild(sprite);
    pixi.app.stage.on("pointermove", onDragMove);

    setDrawTarget(sprite);
    setStartPoint({ x: inverted.x, y: inverted.y });
  };

  onMount(() => {
    pixi.app.stage.on("pointerdown", onPointerDown);
  });

  onCleanup(() => {
    pixi.app.stage.off("pointerdown", onPointerDown);
  });

  createEffect(() => {
    const target = drawTarget();
    if (!target) {
      return;
    }

    const onDragEnd = () => {
      pixi.app.stage.off("pointermove", onDragMove);
      pixi.app.stage.removeChild(target);

      setDrawTarget();

      // const newSample: Sample = {
      //   id: `${Math.random()}`,
      //   shape: {
      //     height: target.height,
      //     width: target.width,
      //     x: target.x,
      //     y: target.y,
      //   },
      // };

      // setSelectedId(newSample.id);

      // workspace.onChange("samples", (samples) => [...samples, newSample]);
      // workspace.onChange("tool", "selector");
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
};

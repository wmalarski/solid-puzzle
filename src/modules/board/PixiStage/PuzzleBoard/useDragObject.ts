import type * as PIXI from "pixi.js";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import type { Point2D } from "~/utils/geometry";

type UseDragObjectArgs = {
  onDragEnd?: (event: PIXI.FederatedMouseEvent) => void;
  onDragMove?: (event: PIXI.FederatedMouseEvent) => void;
  onDragStart?: (event: PIXI.FederatedMouseEvent) => void;
  displayObject: PIXI.DisplayObject;
};

export const useDragObject = (args: UseDragObjectArgs) => {
  const [shift, setShift] = createSignal<Point2D>();

  const onDragMove = (event: PIXI.FederatedPointerEvent) => {
    const point = shift();
    const parent = args.displayObject.parent;
    if (!point || !parent) {
      return;
    }

    parent.toLocal(event.global, undefined, args.displayObject.position);
    args.displayObject.position.set(
      args.displayObject.x - point.x,
      args.displayObject.y - point.y
    );

    args.onDragMove?.(event);
  };

  const onPointerDown = (event: PIXI.FederatedMouseEvent) => {
    const parent = args.displayObject.parent;

    if (event.button === 2 || !parent) {
      return;
    }

    event.stopPropagation();

    const transform = parent.transform.worldTransform;
    const inverted = transform.applyInverse(event.global);

    setShift({
      x: inverted.x - args.displayObject.x,
      y: inverted.y - args.displayObject.y,
    });

    parent.on("pointermove", onDragMove);
    args.onDragStart?.(event);
  };

  onMount(() => {
    args.displayObject.on("pointerdown", onPointerDown);
  });

  onCleanup(() => {
    args.displayObject.off("pointerdown", onPointerDown);
  });

  createEffect(() => {
    const parent = args.displayObject.parent;
    if (!shift() || !parent) {
      return;
    }

    const onDragEnd = (event: PIXI.FederatedMouseEvent) => {
      parent.off("pointermove", onDragMove);
      setShift();
      args.onDragEnd?.(event);
    };

    onMount(() => {
      parent.on("pointerup", onDragEnd);
      parent.on("pointerupoutside", onDragEnd);
    });

    onCleanup(() => {
      parent.off("pointerup", onDragEnd);
      parent.off("pointerupoutside", onDragEnd);
    });
  });
};

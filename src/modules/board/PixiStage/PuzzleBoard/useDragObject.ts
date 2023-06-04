import type * as PIXI from "pixi.js";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import type { Point2D } from "~/utils/geometry";

type DragConstraintArgs = {
  shift: Point2D;
  eventPosition: Point2D;
};

type UseDragObjectArgs = {
  dragConstraint?: (args: DragConstraintArgs) => Point2D;
  onDragEnd?: (event: PIXI.FederatedMouseEvent) => void;
  onDragMove?: (event: PIXI.FederatedMouseEvent) => void;
  onDragStart?: (event: PIXI.FederatedMouseEvent) => void;
  displayObject: PIXI.DisplayObject;
};

const defaultDragConstraint = (args: DragConstraintArgs) => {
  return {
    x: args.eventPosition.x - args.shift.x,
    y: args.eventPosition.y - args.shift.y,
  };
};

export const useDragObject = (args: UseDragObjectArgs) => {
  const [shift, setShift] = createSignal<Point2D>();

  const onDragMove = (event: PIXI.FederatedPointerEvent) => {
    const point = shift();
    const parent = args.displayObject.parent;
    if (!point || !parent) {
      return;
    }

    const local = parent.toLocal(event.global);
    const dragConstraint = args.dragConstraint || defaultDragConstraint;
    const afterConstraint = dragConstraint({
      eventPosition: local,
      shift: point,
    });

    args.displayObject.position.set(afterConstraint.x, afterConstraint.y);

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

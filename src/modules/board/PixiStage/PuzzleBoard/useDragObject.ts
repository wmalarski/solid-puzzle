import type * as PIXI from "pixi.js";
import { createSignal, onCleanup, onMount } from "solid-js";
import { subtractPoint, type Point2D } from "~/utils/geometry";

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
  return subtractPoint(args.eventPosition, args.shift);
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

  const onDragEnd = (event: PIXI.FederatedMouseEvent) => {
    const parent = args.displayObject.parent;

    if (!parent) {
      return;
    }

    parent.off("pointermove", onDragMove);
    parent.off("pointerup", onDragEnd);
    parent.off("pointerupoutside", onDragEnd);

    setShift();
    args.onDragEnd?.(event);
  };

  const onPointerDown = (event: PIXI.FederatedMouseEvent) => {
    const parent = args.displayObject.parent;

    if (event.button === 2 || !parent) {
      return;
    }

    event.stopPropagation();

    const transform = parent.transform.worldTransform;
    const inverted = transform.applyInverse(event.global);

    setShift(subtractPoint(inverted, args.displayObject));

    parent.on("pointermove", onDragMove);
    parent.once("pointerup", onDragEnd);
    parent.once("pointerupoutside", onDragEnd);

    args.onDragStart?.(event);
  };

  onMount(() => {
    args.displayObject.on("pointerdown", onPointerDown);
  });

  onCleanup(() => {
    args.displayObject.off("pointerdown", onPointerDown);
  });
};

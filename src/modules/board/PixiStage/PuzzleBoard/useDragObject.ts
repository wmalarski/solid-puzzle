import type {
  Container,
  FederatedMouseEvent,
  FederatedPointerEvent
} from "pixi.js";

import { createSignal, onCleanup, onMount } from "solid-js";

import { type Point2D, subtractPoint } from "~/utils/geometry";

import { usePixiApp } from "../PixiApp";
import { RIGHT_BUTTON } from "../constants";

type DragConstraintArgs = {
  eventPosition: Point2D;
  shift: Point2D;
};

type UseDragObjectArgs = {
  displayObject: Container;
  dragConstraint?: (args: DragConstraintArgs) => Point2D;
  onDragEnd?: (event: FederatedMouseEvent) => void;
  onDragMove?: (event: FederatedMouseEvent) => void;
  onDragStart?: (event: FederatedMouseEvent) => void;
};

const defaultDragConstraint = (args: DragConstraintArgs) => {
  return subtractPoint(args.eventPosition, args.shift);
};

export const useDragObject = (args: UseDragObjectArgs) => {
  const app = usePixiApp();

  const [shift, setShift] = createSignal<Point2D>();

  const onDragMove = (event: FederatedPointerEvent) => {
    const point = shift();
    const parent = args.displayObject.parent;
    if (!point || !parent) {
      return;
    }

    const local = parent.toLocal(event.global);
    const dragConstraint = args.dragConstraint || defaultDragConstraint;
    const afterConstraint = dragConstraint({
      eventPosition: local,
      shift: point
    });

    args.displayObject.position.set(afterConstraint.x, afterConstraint.y);

    args.onDragMove?.(event);
  };

  const onDragEnd = (event: FederatedMouseEvent) => {
    const parent = args.displayObject.parent;

    if (!parent) {
      return;
    }

    parent.off("pointermove", onDragMove);
    parent.off("pointerup", onDragEnd);
    parent.off("pointerupoutside", onDragEnd);

    setShift();
    args.onDragEnd?.(event);

    app.canvas.style.cursor = "default";
  };

  const onPointerDown = (event: FederatedMouseEvent) => {
    const parent = args.displayObject.parent;

    if (event.button === RIGHT_BUTTON || !parent) {
      return;
    }

    event.stopPropagation();

    const transform = parent.worldTransform;
    const inverted = transform.applyInverse(event.global);

    setShift(subtractPoint(inverted, args.displayObject));

    parent.on("pointermove", onDragMove);
    parent.once("pointerup", onDragEnd);
    parent.once("pointerupoutside", onDragEnd);

    args.onDragStart?.(event);

    app.canvas.style.cursor = "grab";
  };

  onMount(() => {
    args.displayObject.on("pointerdown", onPointerDown);
  });

  onCleanup(() => {
    args.displayObject.off("pointerdown", onPointerDown);
  });
};

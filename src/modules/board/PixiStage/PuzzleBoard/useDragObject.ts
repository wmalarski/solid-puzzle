import type * as PIXI from "pixi.js";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import type { Point2D } from "~/utils/geometry";

type Props = {
  onDragEnd?: (event: PIXI.FederatedMouseEvent) => void;
  onDragMove?: (event: PIXI.FederatedMouseEvent) => void;
  onDragStart?: (event: PIXI.FederatedMouseEvent) => void;
  displayObject: PIXI.DisplayObject;
};

export const useDragObject = (props: Props) => {
  const [shift, setShift] = createSignal<Point2D>();

  const onDragMove = (event: PIXI.FederatedPointerEvent) => {
    const point = shift();
    const parent = props.displayObject.parent;
    if (!point || !parent) {
      return;
    }

    parent.toLocal(event.global, undefined, props.displayObject.position);
    props.displayObject.position.set(
      props.displayObject.x - point.x,
      props.displayObject.y - point.y
    );

    props.onDragMove?.(event);
  };

  const onPointerDown = (event: PIXI.FederatedMouseEvent) => {
    const parent = props.displayObject.parent;

    if (event.button === 2 || !parent) {
      return;
    }

    event.stopPropagation();

    const transform = parent.transform.worldTransform;
    const inverted = transform.applyInverse(event.global);

    setShift({
      x: inverted.x - props.displayObject.x,
      y: inverted.y - props.displayObject.y,
    });

    parent.on("pointermove", onDragMove);
    props.onDragStart?.(event);
  };

  onMount(() => {
    props.displayObject.on("pointerdown", onPointerDown);
  });

  onCleanup(() => {
    props.displayObject.off("pointerdown", onPointerDown);
  });

  createEffect(() => {
    const parent = props.displayObject.parent;
    if (!shift() || !parent) {
      return;
    }

    const onDragEnd = (event: PIXI.FederatedMouseEvent) => {
      parent.off("pointermove", onDragMove);
      setShift();
      props.onDragEnd?.(event);
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

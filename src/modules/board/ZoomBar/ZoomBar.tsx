import type { Component } from "solid-js";
import { Button } from "~/components/Button";
import { MinusIcon } from "~/components/Icons/MinusIcon";
import { PlusIcon } from "~/components/Icons/PlusIcon";
import { useTransformContext } from "../TransformContext";

export const ZoomBar: Component = () => {
  const transform = useTransformContext();

  const onZoomInClick = () => {
    transform.zoomIn({ x: 0, y: 0 });
  };

  const onZoomOutClick = () => {
    transform.zoomOut({ x: 0, y: 0 });
  };

  return (
    <div class="absolute bottom-4 left-4 flex gap-1 rounded-3xl bg-base-300 p-1 shadow">
      <Button variant="ghost" size="sm" onClick={onZoomInClick}>
        <PlusIcon />
      </Button>
      <Button variant="ghost" size="sm" onClick={onZoomOutClick}>
        <MinusIcon />
      </Button>
    </div>
  );
};

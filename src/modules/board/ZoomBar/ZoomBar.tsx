import type { Component } from "solid-js";
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
    <div class="absolute bottom-4 left-4 flex gap-4 bg-neutral-200 p-4">
      <button onClick={onZoomInClick}>+</button>
      <button onClick={onZoomOutClick}>-</button>
    </div>
  );
};

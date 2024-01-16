import type { Component } from "solid-js";

import { Button } from "~/components/Button";
import { MinusIcon } from "~/components/Icons/MinusIcon";
import { PlusIcon } from "~/components/Icons/PlusIcon";
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipRoot,
  TooltipTrigger
} from "~/components/Tooltip";

import { useTransformContext } from "../TransformContext";

export const ZoomBar: Component = () => {
  const transform = useTransformContext();

  const center = () => {
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  };

  const onZoomInClick = () => {
    transform.zoomIn(center());
  };

  const onZoomOutClick = () => {
    transform.zoomOut(center());
  };

  const onZoomResetClick = () => {
    transform.reset();
  };

  return (
    <div class="absolute bottom-4 left-4 flex gap-1 rounded-3xl bg-base-300 p-1 shadow">
      <TooltipRoot>
        <TooltipTrigger class="tooltip__trigger">Trigger</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>
            <TooltipArrow />
            <p>Tooltip content</p>
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
      <Button onClick={onZoomInClick} size="sm" variant="ghost">
        <PlusIcon />
      </Button>
      <Button
        class="tabular-nums"
        onClick={onZoomResetClick}
        size="sm"
        variant="ghost"
      >
        {Math.round(transform.scale() * 100)}%
      </Button>
      <Button onClick={onZoomOutClick} size="sm" variant="ghost">
        <MinusIcon />
      </Button>
    </div>
  );
};

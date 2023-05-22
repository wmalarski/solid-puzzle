import * as PIXI from "pixi.js";
import { createEffect } from "solid-js";
import { useZoomParams, ZoomParams } from "../Workspace.utils";

const defaultZoomState: ZoomParams = {
  scale: 1,
  x: 0,
  y: 0,
};

type Props = {
  app: PIXI.Application;
};

export const useZoom = (props: Props) => {
  const { setZoomParams, zoomParams } = useZoomParams();

  const resetZoom = () => {
    setZoomParams(defaultZoomState);
  };

  createEffect(() => {
    const state = zoomParams();
    props.app.stage.transform.position.set(state.x, state.y);
    props.app.stage.transform.scale.set(state.scale);
  });

  return { resetZoom };
};

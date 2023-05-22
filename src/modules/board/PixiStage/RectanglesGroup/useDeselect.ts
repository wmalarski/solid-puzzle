import type * as PIXI from "pixi.js";
import { onCleanup, onMount } from "solid-js";
import { usePixiContext } from "../PixiContext";

export const useDeselect = () => {
  const pixi = usePixiContext();
  // const { setSelectedId } = useSelectedId();

  const onPointerDown = (event: PIXI.FederatedPointerEvent) => {
    if (event.target === pixi.app.stage && event.button !== 2) {
      // setSelectedId();
    }
  };

  onMount(() => {
    pixi.app.stage.on("pointerdown", onPointerDown);
  });

  onCleanup(() => {
    pixi.app.stage.off("pointerdown", onPointerDown);
  });
};

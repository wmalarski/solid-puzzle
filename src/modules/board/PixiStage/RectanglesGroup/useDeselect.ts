import type * as PIXI from "pixi.js";
import { onCleanup, onMount } from "solid-js";
import { usePixiApp } from "../PixiApp";

export const useDeselect = () => {
  const pixi = usePixiApp();
  // const { setSelectedId } = useSelectedId();

  const onPointerDown = (event: PIXI.FederatedPointerEvent) => {
    if (event.target === pixi().stage && event.button !== 2) {
      // setSelectedId();
    }
  };

  onMount(() => {
    pixi().stage.on("pointerdown", onPointerDown);
  });

  onCleanup(() => {
    pixi().stage.off("pointerdown", onPointerDown);
  });
};

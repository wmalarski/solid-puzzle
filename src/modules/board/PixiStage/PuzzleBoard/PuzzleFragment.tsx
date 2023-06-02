import * as PIXI from "pixi.js";
import {
  createEffect,
  createMemo,
  onCleanup,
  onMount,
  type Component,
} from "solid-js";
import { randomHexColor } from "~/utils/colors";
import { usePixiApp } from "../PixiApp";
import type { PuzzleFragmentShape } from "./generatePuzzleFragments";
import { useDragObject } from "./useDragObject";

type PuzzleFragmentGraphicsProps = {
  container: PIXI.Container;
  isSelected: boolean;
  shape: PuzzleFragmentShape;
  texture: PIXI.Texture;
};

export const PuzzleFragmentGraphics: Component<PuzzleFragmentGraphicsProps> = (
  props
) => {
  const graphics = new PIXI.Graphics();
  graphics.zIndex = 0;

  onMount(() => {
    graphics.beginTextureFill({
      matrix: new PIXI.Matrix(1, 0, 0, 1),
      texture: props.texture,
    });
    graphics.lineStyle(4, randomHexColor(), 1);
    graphics.moveTo(props.shape.start.x, props.shape.start.y);

    props.shape.curvePoints.forEach(({ control, to }) => {
      graphics.quadraticCurveTo(control.x, control.y, to.x, to.y);
    });

    graphics.endFill();
  });

  onMount(() => {
    props.container.addChild(graphics);
  });

  onCleanup(() => {
    props.container.removeChild(graphics);
    graphics.destroy();
  });

  createEffect(() => {
    graphics.tint = props.isSelected ? "red" : "white";
  });

  return null;
};

type PuzzleFragmentProps = {
  onSelect: (fragmentId: string) => void;
  selectedId?: string;
  shape: PuzzleFragmentShape;
  texture: PIXI.Texture;
};

export const PuzzleFragment: Component<PuzzleFragmentProps> = (props) => {
  const app = usePixiApp();

  const container = new PIXI.Container();
  container.eventMode = "static";

  useDragObject({
    displayObject: container,
    onDragStart: () => {
      props.onSelect(props.shape.fragmentId);
    },
  });

  onMount(() => {
    app().stage.addChild(container);
  });

  onCleanup(() => {
    app().stage.removeChild(container);
  });

  const isSelected = createMemo(() => {
    return props.selectedId === props.shape.fragmentId;
  });

  createEffect(() => {
    container.zIndex = isSelected() ? 1 : 0;
  });

  return (
    <PuzzleFragmentGraphics
      container={container}
      isSelected={isSelected()}
      shape={props.shape}
      texture={props.texture}
    />
  );
};

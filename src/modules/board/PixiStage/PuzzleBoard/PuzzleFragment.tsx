import { Container, Graphics, Matrix, Text, type Texture } from "pixi.js";
import {
  type Component,
  Show,
  createEffect,
  createMemo,
  onCleanup,
  onMount,
} from "solid-js";

import type { PuzzleFragmentShape } from "~/utils/getPuzzleFragments";

import { type Point2D, getCenterFromPoints } from "~/utils/geometry";

import {
  type FragmentState,
  usePuzzleStore,
} from "../../DataProviders/PuzzleProvider";
import { usePlayerSelection } from "../../DataProviders/SelectionProvider";
import { useBoardTheme } from "../BoardTheme";
import { usePixiApp } from "../PixiApp";
import { RotationAnchor } from "./RotationAnchor";
import { useDragObject } from "./useDragObject";

type PuzzleFragmentLabelProps = {
  container: Container;
  label: string;
};

const PuzzleFragmentLabel: Component<PuzzleFragmentLabelProps> = (props) => {
  const text = new Text();
  text.scale.set(0.5);

  createEffect(() => {
    text.text = props.label;
  });

  onMount(() => {
    props.container.addChild(text);
  });

  onCleanup(() => {
    props.container.removeChild(text);
  });

  return null;
};

const drawPuzzleShape = (shape: PuzzleFragmentShape, graphics: Graphics) => {
  const matrix = new Matrix(1, 0, 0, 1);
  matrix.translate(-shape.min.x, -shape.min.y);

  const elements = shape.curvePoints;
  const last = elements[elements.length - 1];

  graphics.moveTo(last.to.x, last.to.y);
  shape.curvePoints.forEach(({ control, to }) => {
    graphics.quadraticCurveTo(control.x, control.y, to.x, to.y);
  });

  return matrix;
};

type PuzzleBorderGraphicsProps = {
  center: Point2D;
  container: Container;
  shape: PuzzleFragmentShape;
  state: FragmentState;
};

const PuzzleBorderGraphics: Component<PuzzleBorderGraphicsProps> = (props) => {
  const theme = useBoardTheme();

  const graphics = new Graphics();

  onMount(() => {
    const matrix = drawPuzzleShape(props.shape, graphics);

    graphics.stroke({
      color: theme.fragmentBorderSelectedColor,
      matrix,
      width: 2,
    });

    graphics.pivot.set(props.center.x, props.center.y);
  });

  onMount(() => {
    props.container.addChild(graphics);
  });

  onCleanup(() => {
    props.container.removeChild(graphics);
    graphics.destroy();
  });

  createEffect(() => {
    graphics.rotation = props.state.isLocked ? 0 : props.state.rotation;
  });

  return null;
};

type PuzzleFragmentGraphicsProps = {
  center: Point2D;
  container: Container;
  isSelected: boolean;
  shape: PuzzleFragmentShape;
  state: FragmentState;
  texture: Texture;
};

const PuzzleFragmentGraphics: Component<PuzzleFragmentGraphicsProps> = (
  props,
) => {
  const theme = useBoardTheme();

  const graphics = new Graphics();

  onMount(() => {
    const matrix = drawPuzzleShape(props.shape, graphics);

    graphics.fill({ matrix, texture: props.texture });
    graphics.stroke({
      color: theme.fragmentBorderColor,
      matrix,
      width: 1,
    });

    graphics.pivot.set(props.center.x, props.center.y);
  });

  onMount(() => {
    props.container.addChild(graphics);
  });

  onCleanup(() => {
    props.container.removeChild(graphics);
    graphics.destroy();
  });

  createEffect(() => {
    graphics.rotation = props.state.isLocked ? 0 : props.state.rotation;
  });

  return null;
};

type PuzzleContainerProps = {
  shape: PuzzleFragmentShape;
  state: FragmentState;
  texture: Texture;
};

const PuzzleContainer: Component<PuzzleContainerProps> = (props) => {
  const store = usePuzzleStore();
  const selection = usePlayerSelection();
  const app = usePixiApp();

  const fragment = new Container();

  onMount(() => {
    app.stage.addChild(fragment);
  });

  onCleanup(() => {
    app.stage.removeChild(fragment);
  });

  const center = createMemo(() => {
    return getCenterFromPoints(
      props.shape.curvePoints.map((point) => point.to),
    );
  });

  onMount(() => {
    const centerValue = center();
    fragment.pivot.set(-centerValue.x, -centerValue.y);

    fragment.x = props.shape.min.x;
    fragment.y = props.shape.min.y;
  });

  createEffect(() => {
    if (!props.state.isLocked) {
      fragment.eventMode = "static";
      return;
    }
    fragment.eventMode = "none";
    fragment.x = props.shape.min.x;
    fragment.y = props.shape.min.y;
  });

  const fragmentId = createMemo(() => {
    return props.shape.fragmentId;
  });

  const isFragmentSelected = createMemo(() => {
    return fragmentId() === selection.selectedId();
  });

  const zIndex = createMemo(() => {
    return isFragmentSelected() ? 1 : 0;
  });

  createEffect(() => {
    fragment.zIndex = zIndex();
  });

  useDragObject({
    displayObject: fragment,
    onDragEnd: () => {
      store.setFragmentStateWithLockCheck({
        fragmentId: props.shape.fragmentId,
        rotation: props.state.rotation,
        x: fragment.x,
        y: fragment.y,
      });
    },
    onDragStart: () => {
      selection.select(fragmentId());
    },
  });

  const rotationOffset = Math.random() * 2 * Math.PI;

  const onRotationEnd = (rotation: number) => {
    store.setFragmentStateWithLockCheck({ ...props.state, rotation });
  };

  const onRotationMove = (rotation: number) => {
    store.setFragmentState({ ...props.state, rotation });
  };

  return (
    <>
      <PuzzleFragmentGraphics
        center={center()}
        container={fragment}
        isSelected={isFragmentSelected()}
        shape={props.shape}
        state={props.state}
        texture={props.texture}
      />
      <PuzzleFragmentLabel container={fragment} label={fragmentId()} />
      <Show when={isFragmentSelected()}>
        <>
          <PuzzleBorderGraphics
            center={center()}
            container={fragment}
            shape={props.shape}
            state={props.state}
          />
          <RotationAnchor
            container={fragment}
            onEnd={onRotationEnd}
            onRotate={onRotationMove}
            rotation={props.state.rotation}
            rotationOffset={rotationOffset}
          />
        </>
      </Show>
    </>
  );
};

type PuzzleFragmentProps = {
  shape: PuzzleFragmentShape;
  texture: Texture;
};

export const PuzzleFragment: Component<PuzzleFragmentProps> = (props) => {
  const store = usePuzzleStore();

  const state = createMemo(() => {
    return store.fragments[props.shape.fragmentId];
  });

  return (
    <Show when={state()}>
      {(state) => (
        <PuzzleContainer
          shape={props.shape}
          state={state()}
          texture={props.texture}
        />
      )}
    </Show>
  );
};

import { Container, Graphics, Matrix, Text, type Texture } from "pixi.js";
import {
  Show,
  createEffect,
  createMemo,
  onCleanup,
  onMount,
  type Component,
} from "solid-js";
import { getCenterFromPoints, type Point2D } from "~/utils/geometry";
import type { PuzzleFragmentShape } from "~/utils/getPuzzleFragments";
import { usePlayerPresence } from "../../DataProviders/PresenceProvider";
import { usePuzzleStore } from "../../DataProviders/PuzzleProvider";
import { usePixiApp } from "../PixiApp";
import { type FragmentState } from "./PuzzleStore";
import { RotationAnchor } from "./RotationAnchor";
import { useDragObject } from "./useDragObject";

type PuzzleFragmentLabelProps = {
  container: Container;
  label: string;
};

const PuzzleFragmentLabel: Component<PuzzleFragmentLabelProps> = (props) => {
  const text = new Text();

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

type PuzzleFragmentGraphicsProps = {
  center: Point2D;
  container: Container;
  shape: PuzzleFragmentShape;
  state: FragmentState;
  texture: Texture;
};

export const PuzzleFragmentGraphics: Component<PuzzleFragmentGraphicsProps> = (
  props,
) => {
  const graphics = new Graphics();

  onMount(() => {
    const matrix = new Matrix(1, 0, 0, 1);
    matrix.translate(-props.shape.min.x, -props.shape.min.y);

    const elements = props.shape.curvePoints;
    const last = elements[elements.length - 1];

    graphics.moveTo(last.to.x, last.to.y);
    props.shape.curvePoints.forEach(({ control, to }) => {
      graphics.quadraticCurveTo(control.x, control.y, to.x, to.y);
    });

    graphics.fill({ matrix, texture: props.texture });

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
  const presence = usePlayerPresence();
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
    return fragmentId() === presence.playerSelection();
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
      store.setFragmentState({
        fragmentId: props.shape.fragmentId,
        rotation: props.state.rotation,
        x: fragment.x,
        y: fragment.y,
      });
    },
    onDragStart: () => {
      presence.setPlayerSelection(fragmentId());
    },
  });

  const rotationOffset = Math.random() * 2 * Math.PI;

  const onRotationEnd = (rotation: number) => {
    store.setFragmentState({ ...props.state, rotation });
  };

  const onRotationMove = (rotation: number) => {
    store.setFragmentState({ ...props.state, rotation });
  };

  return (
    <>
      <PuzzleFragmentGraphics
        center={center()}
        container={fragment}
        shape={props.shape}
        state={props.state}
        texture={props.texture}
      />
      <PuzzleFragmentLabel container={fragment} label={fragmentId()} />
      <Show when={isFragmentSelected()}>
        <RotationAnchor
          container={fragment}
          onEnd={onRotationEnd}
          onRotate={onRotationMove}
          rotation={props.state.rotation}
          rotationOffset={rotationOffset}
        />
      </Show>
    </>
  );
};

type PuzzleFragmentProps = {
  texture: Texture;
  shape: PuzzleFragmentShape;
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
          texture={props.texture}
          state={state()}
        />
      )}
    </Show>
  );
};

import { Container, Graphics, Matrix, type Texture } from "pixi.js";
import { createEffect, createMemo, onCleanup, onMount, Show } from "solid-js";

import type { PuzzleFragmentShape } from "~/utils/getPuzzleFragments";

import { getCenterFromPoints, type Point2D } from "~/utils/geometry";

import { usePlayerPresence } from "../../DataProviders/PresenceProvider";
import {
  type FragmentState,
  usePuzzleStore
} from "../../DataProviders/PuzzleProvider";
import { usePlayerSelection } from "../../DataProviders/SelectionProvider";
import { useBoardTheme } from "../BoardTheme";
import { usePixiContainer } from "../PixiApp";
import { RotationAnchor } from "./RotationAnchor";
import { useDragObject } from "./useDragObject";

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
  color: number | string;
  container: Container;
  shape: PuzzleFragmentShape;
  state: FragmentState;
};

function PuzzleBorderGraphics(props: PuzzleBorderGraphicsProps) {
  const theme = useBoardTheme();

  const graphics = new Graphics();

  onMount(() => {
    const matrix = drawPuzzleShape(props.shape, graphics);

    graphics.stroke({
      color: props.color,
      matrix,
      width: theme.fragmentBorderWidth
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
}

type PuzzleFragmentGraphicsProps = {
  center: Point2D;
  container: Container;
  shape: PuzzleFragmentShape;
  state: FragmentState;
  texture: Texture;
};

function PuzzleFragmentGraphics(props: PuzzleFragmentGraphicsProps) {
  const graphics = new Graphics();

  createEffect(() => {
    graphics.clear();

    const matrix = drawPuzzleShape(props.shape, graphics);

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
}

type PuzzleFragmentProps = {
  shape: PuzzleFragmentShape;
  state: FragmentState;
  texture: Texture;
};

export function PuzzleFragment(props: PuzzleFragmentProps) {
  const store = usePuzzleStore();
  const selection = usePlayerSelection();
  const presence = usePlayerPresence();

  const container = usePixiContainer();
  const theme = useBoardTheme();

  const fragment = new Container();

  onMount(() => {
    container.addChild(fragment);
  });

  onCleanup(() => {
    container.removeChild(fragment);
  });

  const center = createMemo(() => {
    return getCenterFromPoints(
      props.shape.curvePoints.map((point) => point.to)
    );
  });

  onMount(() => {
    const centerValue = center();
    fragment.pivot.set(-centerValue.x, -centerValue.y);
  });

  createEffect(() => {
    fragment.x = props.state.isLocked ? props.shape.min.x : props.state.x;
  });

  createEffect(() => {
    fragment.y = props.state.isLocked ? props.shape.min.y : props.state.y;
  });

  const remotePlayerSelection = createMemo(() => {
    const remotePlayerId =
      selection().fragmentSelection()[props.state.fragmentId];
    if (!remotePlayerId) {
      return null;
    }

    const remotePlayer = presence.players[remotePlayerId];
    if (!remotePlayer) {
      return null;
    }

    return remotePlayer;
  });

  createEffect(() => {
    const shouldBeBlocked = props.state.isLocked || remotePlayerSelection();
    fragment.eventMode = shouldBeBlocked ? "none" : "static";
  });

  const isCurrentPlayerSelected = createMemo(() => {
    return props.state.fragmentId === selection().selectedId();
  });

  createEffect(() => {
    fragment.zIndex = props.state.isLocked
      ? theme.fragmentLockedZIndex
      : isCurrentPlayerSelected()
        ? theme.fragmentSelectedZIndex
        : remotePlayerSelection()
          ? theme.fragmentRemoteZIndex
          : theme.fragmentZIndex;
  });

  useDragObject({
    displayObject: fragment,
    onDragEnd: () => {
      store.setFragmentStateWithLockCheck({
        fragmentId: props.state.fragmentId,
        rotation: props.state.rotation,
        x: fragment.x,
        y: fragment.y
      });
    },
    onDragMove: () => {
      store.sendFragmentState({
        fragmentId: props.state.fragmentId,
        rotation: props.state.rotation,
        x: fragment.x,
        y: fragment.y
      });
    },
    onDragStart: () => {
      selection().select(props.state.fragmentId);
    }
  });

  const rotationOffset = Math.random() * 2 * Math.PI;

  const onRotationEnd = (rotation: number) => {
    const change = { ...props.state, rotation };
    store.setFragmentStateWithLockCheck(change);
  };

  const onRotationMove = (rotation: number) => {
    const change = { ...props.state, rotation };
    store.sendFragmentState(change);
    store.setFragmentState(change);
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
      <Show when={remotePlayerSelection()}>
        {(remotePlayer) => (
          <PuzzleBorderGraphics
            center={center()}
            color={remotePlayer().color}
            container={fragment}
            shape={props.shape}
            state={props.state}
          />
        )}
      </Show>
      <Show when={isCurrentPlayerSelected()}>
        <>
          <PuzzleBorderGraphics
            center={center()}
            color={presence.currentPlayer().color}
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
}

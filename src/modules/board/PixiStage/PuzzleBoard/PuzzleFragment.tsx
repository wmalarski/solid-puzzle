import * as PIXI from "pixi.js";
import {
  Show,
  createEffect,
  createMemo,
  onCleanup,
  onMount,
  type Component,
} from "solid-js";
import { randomHexColor } from "~/utils/colors";
import type { PuzzleFragmentShape } from "~/utils/getPuzzleFragments";
import { usePlayerPresence } from "../../DataProviders/PresenceProvider";
import { usePuzzleStore } from "../../DataProviders/PuzzleProvider";
import { usePixiApp } from "../PixiApp";
import { type FragmentState } from "./PuzzleStore";
import { RotationAnchor } from "./RotationAnchor";
import { useDragObject } from "./useDragObject";

type PuzzleFragmentLabelProps = {
  container: PIXI.Container;
  label: string;
};

export const PuzzleFragmentLabel: Component<PuzzleFragmentLabelProps> = (
  props,
) => {
  const text = new PIXI.Text();

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
  container: PIXI.Container;
  state: FragmentState;
  shape: PuzzleFragmentShape;
  texture: PIXI.Texture;
};

export const PuzzleFragmentGraphics: Component<PuzzleFragmentGraphicsProps> = (
  props,
) => {
  const graphics = new PIXI.Graphics();

  onMount(() => {
    const matrix = new PIXI.Matrix(1, 0, 0, 1);
    matrix.translate(-props.shape.min.x, -props.shape.min.y);

    graphics.beginTextureFill({ matrix, texture: props.texture });
    graphics.lineStyle(4, randomHexColor(), 1);

    const elements = props.shape.curvePoints;
    const last = elements[elements.length - 1];
    graphics.moveTo(last.to.x, last.to.y);
    props.shape.curvePoints.forEach(({ control, to }) => {
      graphics.quadraticCurveTo(control.x, control.y, to.x, to.y);
    });

    graphics.endFill();
    // graphics.pivot.set(graphics.width / 2, graphics.height / 2);
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
  texture: PIXI.Texture;
};

const PuzzleContainer: Component<PuzzleContainerProps> = (props) => {
  const app = usePixiApp();
  const store = usePuzzleStore();
  const presence = usePlayerPresence();

  const fragment = new PIXI.Container();

  onMount(() => {
    // console.log(
    //   "PuzzleFragment",
    //   JSON.stringify({ shape: props.shape, state: props.state }, null, 2)
    // );
    app().stage.addChild(fragment);
  });

  onCleanup(() => {
    app().stage.removeChild(fragment);
  });

  onMount(() => {
    // fragment.pivot.set(
    //   fragment.width / 2,
    //   fragment.height / 2
    //   // props.shape.max.x - props.shape.min.x,
    //   // props.shape.max.y - props.shape.min.y
    // );
    fragment.pivot.set(fragment.width / 2, fragment.height / 2);
    fragment.x = props.shape.min.x;
    fragment.y = props.shape.min.y;
  });

  createEffect(() => {
    // if (!state().isLocked) {
    //   fragment.eventMode = "static";
    //   return;
    // }
    // fragment.eventMode = "none";
    // fragment.x = props.shape.min.x;
    // fragment.y = props.shape.min.y;
  });

  const fragmentId = createMemo(() => {
    return props.shape.fragmentId;
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

  const onRotationEnd = (rotation: number) => {
    store.setFragmentState({ ...props.state, rotation });
  };

  const onRotationMove = (rotation: number) => {
    store.setFragmentState({ ...props.state, rotation });
  };

  return (
    <>
      <PuzzleFragmentGraphics
        container={fragment}
        state={props.state}
        shape={props.shape}
        texture={props.texture}
      />
      <PuzzleFragmentLabel container={fragment} label={fragmentId()} />
      <Show when={presence.playerSelection() === fragmentId()}>
        <RotationAnchor
          container={fragment}
          rotation={props.state.rotation}
          onEnd={onRotationEnd}
          onRotate={onRotationMove}
        />
      </Show>
    </>
  );
};

type PuzzleFragmentProps = {
  texture: PIXI.Texture;
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

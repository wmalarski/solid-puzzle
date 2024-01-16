import { type FederatedPointerEvent, Graphics } from "pixi.js";
import {
  type Component,
  For,
  Show,
  createEffect,
  createMemo,
  onCleanup,
  onMount
} from "solid-js";

import {
  type PlayerCursorState,
  usePlayerCursors
} from "../../DataProviders/CursorProvider";
import { usePlayerPresence } from "../../DataProviders/PresenceProvider";
import { usePixiApp } from "../PixiApp";

type RotationAnchorProps = {
  playerId: string;
  state: PlayerCursorState;
};

const RemoteCursor: Component<RotationAnchorProps> = (props) => {
  const app = usePixiApp();
  const presence = usePlayerPresence();

  const graphics = new Graphics();
  graphics.zIndex = 2;

  onMount(() => {
    const color = presence.players[props.playerId]?.color;
    graphics.circle(0, 0, 10).fill({ color });
  });

  createEffect(() => {
    graphics.x = props.state.x;
  });

  createEffect(() => {
    graphics.y = props.state.y;
  });

  createEffect(() => {
    graphics.y = props.state.y;
  });

  onMount(() => {
    app.stage.addChild(graphics);
  });

  onCleanup(() => {
    app.stage.removeChild(graphics);
    graphics.destroy();
  });

  return null;
};

const usePlayerCursor = () => {
  const app = usePixiApp();
  const cursors = usePlayerCursors();

  const onPointerMove = (event: FederatedPointerEvent) => {
    const transform = app.stage.worldTransform;
    const inverted = transform.applyInverse(event.global);

    cursors.send({ x: inverted.x, y: inverted.y });
  };

  onMount(() => {
    app.stage.on("pointermove", onPointerMove);
  });

  onCleanup(() => {
    app.stage.off("pointermove", onPointerMove);
  });
};

export const RemoteCursors: Component = () => {
  const cursors = usePlayerCursors();

  usePlayerCursor();

  const playerIds = createMemo(() => {
    return Object.keys(cursors.cursors);
  });

  return (
    <For each={playerIds()}>
      {(playerId) => (
        <Show when={cursors.cursors[playerId]}>
          {(state) => <RemoteCursor playerId={playerId} state={state()} />}
        </Show>
      )}
    </For>
  );
};

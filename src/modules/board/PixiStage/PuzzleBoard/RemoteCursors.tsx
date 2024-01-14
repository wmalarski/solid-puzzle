import { type FederatedPointerEvent, Graphics } from "pixi.js";
import {
  type Component,
  For,
  Show,
  createEffect,
  createMemo,
  onCleanup,
  onMount,
} from "solid-js";

import {
  type PlayerCursorState,
  usePlayerCursors,
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

  onMount(() => {
    const color = presence.players[props.playerId]?.color;

    console.log("COLOR", color);

    graphics.circle(0, 0, 10).fill({ color: 0xffff00 });
  });

  createEffect(() => {
    console.log("X", props.state.x);

    graphics.x = props.state.x;
  });

  createEffect(() => {
    console.log("Y", props.state.y);

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
    cursors.send({ x: event.pageX, y: event.pageY });
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

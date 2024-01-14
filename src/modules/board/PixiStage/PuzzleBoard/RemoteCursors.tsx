import { Graphics } from "pixi.js";
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
  type PlayerState,
  usePlayerPresence,
} from "../../DataProviders/PresenceProvider";
import { usePixiApp } from "../PixiApp";

type RotationAnchorProps = {
  state: PlayerState;
};

const RemoteCursor: Component<RotationAnchorProps> = (props) => {
  const app = usePixiApp();
  // const theme = useBoardTheme();

  const graphics = new Graphics();

  onMount(() => {
    graphics.circle(0, 0, 10).fill({ color: props.state.cursorColor });
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

export const RemoteCursors: Component = () => {
  const presence = usePlayerPresence();

  const playerIds = createMemo(() => {
    return Object.keys(presence.players).filter(
      (playerId) => playerId !== presence.currentPlayer(),
    );
  });

  return (
    <For each={playerIds()}>
      {(playerId) => (
        <Show when={presence.players[playerId]}>
          {(state) => <RemoteCursor state={state()} />}
        </Show>
      )}
    </For>
  );
};

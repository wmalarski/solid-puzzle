import { type FederatedPointerEvent, Graphics, Text, TextStyle } from "pixi.js";
import {
  type Component,
  For,
  Show,
  createEffect,
  createMemo,
  onCleanup,
  onMount
} from "solid-js";

import { usePlayerCursors } from "../../DataProviders/CursorProvider";
import { usePlayerPresence } from "../../DataProviders/PresenceProvider";
import { useBoardTheme } from "../BoardTheme";
import { usePixiContainer } from "../PixiApp";

const CURSOR_SIZE = 20;
const LABEL_PADDING = 5;
const LABEL_SHIFT = CURSOR_SIZE * 1.2;

type CursorGraphicsProps = {
  color: string;
  name: string;
  x: number;
  y: number;
};

const CursorGraphics: Component<CursorGraphicsProps> = (props) => {
  const container = usePixiContainer();
  const theme = useBoardTheme();

  const graphics = new Graphics({ zIndex: 2 });

  const style = new TextStyle({ fontSize: 16 });
  const text = new Text({ style, zIndex: 3 });

  onMount(() => {
    graphics
      .moveTo(0, 0)
      .lineTo(CURSOR_SIZE / 5, CURSOR_SIZE)
      .lineTo(CURSOR_SIZE / 2.2, CURSOR_SIZE / 1.8)
      .lineTo(CURSOR_SIZE / 1.1, CURSOR_SIZE / 2)
      .lineTo(0, 0)
      .fill({ color: props.color })
      .stroke({ color: theme.cursorStrokeColor });

    text.text = props.name;

    graphics
      .rect(
        LABEL_SHIFT - LABEL_PADDING,
        LABEL_SHIFT - LABEL_PADDING,
        text.width + 2 * LABEL_PADDING,
        text.height + 2 * LABEL_PADDING
      )
      .fill({ color: props.color });
  });

  createEffect(() => {
    graphics.x = props.x;
    text.x = props.x + LABEL_SHIFT;
  });

  createEffect(() => {
    graphics.y = props.y;
    text.y = props.y + LABEL_SHIFT;
  });

  onMount(() => {
    container.addChild(graphics);
    container.addChild(text);
  });

  onCleanup(() => {
    container.removeChild(graphics);
    container.removeChild(text);

    graphics.destroy();
    text.destroy();
  });

  return null;
};

const usePlayerCursor = () => {
  const container = usePixiContainer();
  const cursors = usePlayerCursors();

  const onPointerMove = (event: FederatedPointerEvent) => {
    const transform = container.worldTransform;
    const inverted = transform.applyInverse(event.global);

    cursors.send({ x: inverted.x, y: inverted.y });
  };

  onMount(() => {
    container.on("pointermove", onPointerMove);
  });

  onCleanup(() => {
    container.off("pointermove", onPointerMove);
  });
};

export const RemoteCursors: Component = () => {
  const cursors = usePlayerCursors();
  const presence = usePlayerPresence();

  usePlayerCursor();

  const playerIds = createMemo(() => {
    return Object.keys(cursors.cursors);
  });

  return (
    <For each={playerIds()}>
      {(playerId) => (
        <Show when={cursors.cursors[playerId]}>
          {(state) => (
            <Show when={presence.players[playerId]}>
              {(player) => (
                <CursorGraphics
                  color={player().color}
                  name={player().name}
                  x={state().x}
                  y={state().y}
                />
              )}
            </Show>
          )}
        </Show>
      )}
    </For>
  );
};

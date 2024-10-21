import {
  Container,
  type FederatedPointerEvent,
  Graphics,
  Text,
  TextStyle
} from "pixi.js";
import {
  Component,
  createEffect,
  createMemo,
  For,
  onCleanup,
  onMount,
  Show
} from "solid-js";

import { getTextColor } from "~/utils/colors";

import { usePlayerCursors } from "../../DataProviders/CursorProvider";
import { usePlayerPresence } from "../../DataProviders/PresenceProvider";
import { useTransformContext } from "../../TransformContext";
import { useBoardTheme } from "../BoardTheme";
import { usePixiApp, usePixiContainer } from "../PixiApp";

const CURSOR_SIZE = 20;
const LABEL_PADDING = 5;
const LABEL_SHIFT = CURSOR_SIZE * 1.2;

type CursorGraphicsProps = {
  color: string;
  cursorsContainer: Container;
  name: string;
  x: number;
  y: number;
};

const CursorGraphics: Component<CursorGraphicsProps> = (props) => {
  const theme = useBoardTheme();

  const graphics = new Graphics({ zIndex: theme.cursorGraphicsZIndex });

  const style = new TextStyle({ fontSize: 16 });
  const text = new Text({ style, zIndex: theme.cursorTextZIndex });

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
    text.style.fill = getTextColor(props.color);

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
    props.cursorsContainer.addChild(graphics);
    props.cursorsContainer.addChild(text);
  });

  onCleanup(() => {
    props.cursorsContainer.removeChild(graphics);
    props.cursorsContainer.removeChild(text);

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

    cursors().send({ x: inverted.x, y: inverted.y });
  };

  onMount(() => {
    container.on("pointermove", onPointerMove);
  });

  onCleanup(() => {
    container.off("pointermove", onPointerMove);
  });
};

export const RemoteCursors: Component = () => {
  const app = usePixiApp();
  const theme = useBoardTheme();

  const cursorsContainer = new Container({
    zIndex: theme.cursorContainerZIndex
  });

  const cursors = usePlayerCursors();
  const presence = usePlayerPresence();
  const transform = useTransformContext();

  onMount(() => {
    app.stage.addChild(cursorsContainer);
  });

  onCleanup(() => {
    app.stage.removeChild(cursorsContainer);
  });

  usePlayerCursor();

  const playerIds = createMemo(() => {
    return Object.keys(cursors().cursors);
  });

  return (
    <For each={playerIds()}>
      {(playerId) => (
        <Show when={cursors().cursors[playerId]}>
          {(state) => (
            <Show when={presence().players[playerId]}>
              {(player) => (
                <CursorGraphics
                  color={player().color}
                  cursorsContainer={cursorsContainer}
                  name={player().name}
                  x={transform().x() + state().x * transform().scale()}
                  y={transform().y() + state().y * transform().scale()}
                />
              )}
            </Show>
          )}
        </Show>
      )}
    </For>
  );
};

import { type Component, For, Show, createMemo } from "solid-js";

import { Avatar, AvatarContent, AvatarGroup } from "~/components/Avatar";
import {
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from "~/components/Dialog";
import { XIcon } from "~/components/Icons/XIcon";
import { useI18n } from "~/contexts/I18nContext";
import { getTextColor } from "~/utils/colors";

import type { PlayerState } from "../../DataProviders/PresenceProvider";

import { usePlayerPresence } from "../../DataProviders/PresenceProvider";

type PlayerAvatarProps = {
  state: PlayerState;
};

const PlayerAvatar: Component<PlayerAvatarProps> = (props) => {
  return (
    <Avatar>
      <AvatarContent
        placeholder
        ring="secondary"
        size="xs"
        style={{
          "--tw-ring-color": props.state.color,
          "background-color": props.state.color,
          color: getTextColor(props.state.color)
        }}
      >
        <span class="flex size-full items-center justify-center uppercase">
          {props.state.name.slice(0, 2)}
        </span>
      </AvatarContent>
    </Avatar>
  );
};

const PlayersList: Component = () => {
  const presence = usePlayerPresence();

  const playerIds = createMemo(() => {
    return Object.keys(presence.players);
  });

  return (
    <div class="flex max-h-[60vh] min-w-80 flex-col gap-4 overflow-y-auto">
      <For each={playerIds()}>
        {(playerId) => (
          <Show when={presence.players[playerId]}>
            {(state) => (
              <div class="flex gap-4 p-2">
                <PlayerAvatar state={state()} />
                <span>{state().name}</span>
              </div>
            )}
          </Show>
        )}
      </For>
    </div>
  );
};

const MAX_AVATARS = 5;

const Avatars: Component = () => {
  const presence = usePlayerPresence();

  const playerIds = createMemo(() => {
    return Object.keys(presence.players);
  });

  return (
    <AvatarGroup>
      <For each={playerIds().slice(0, MAX_AVATARS)}>
        {(playerId) => (
          <Show when={presence.players[playerId]}>
            {(state) => <PlayerAvatar state={state()} />}
          </Show>
        )}
      </For>
      <Show when={playerIds().length > MAX_AVATARS}>
        <Avatar>
          <AvatarContent class="bg-base-300" ring="primary" size="xs">
            <span class="flex size-full items-center justify-center">
              {`+${playerIds().length - MAX_AVATARS}`}
            </span>
          </AvatarContent>
        </Avatar>
      </Show>
    </AvatarGroup>
  );
};

export const AvatarsDialog: Component = () => {
  const { t } = useI18n();

  return (
    <DialogRoot>
      <DialogTrigger shape="ellipsis" size="md" type="button" variant="ghost">
        <Avatars />
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("board.topBar.players")}</DialogTitle>
              <DialogCloseButton>
                <XIcon />
              </DialogCloseButton>
            </DialogHeader>
            <PlayersList />
          </DialogContent>
        </DialogPositioner>
      </DialogPortal>
    </DialogRoot>
  );
};

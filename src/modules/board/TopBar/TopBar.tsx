import { type Component, For, Show, createMemo } from "solid-js";

import type { BoardAccess, BoardModel } from "~/types/models";

import { Avatar, AvatarContent, AvatarGroup } from "~/components/Avatar";
import { ShareIcon } from "~/components/Icons/ShareIcon";
import { showToast } from "~/components/Toast";
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipRoot,
  TooltipTrigger
} from "~/components/Tooltip";
import { useI18n } from "~/contexts/I18nContext";
import { useSessionContext } from "~/contexts/SessionContext";

import {
  type PlayerState,
  usePlayerPresence
} from "../DataProviders/PresenceProvider";
import { SettingsDialog } from "./SettingsDialog";

export const ShareButton: Component = () => {
  const { t } = useI18n();

  const onShare = async () => {
    const url = location.href;

    if (typeof navigator.share !== "undefined") {
      await navigator.share({ url });
      return;
    }

    navigator.clipboard.writeText(url);

    showToast({
      description: t("board.share.title"),
      title: t("board.share.copy"),
      variant: "success"
    });
  };

  return (
    <TooltipRoot>
      <TooltipTrigger
        aria-label={t("board.share.title")}
        onClick={onShare}
        size="sm"
        type="button"
        variant="ghost"
      >
        <ShareIcon class="size-6" />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>
          <TooltipArrow />
          {t("board.share.title")}
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  );
};

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
          "background-color": props.state.color
        }}
      >
        <span class="flex size-full items-center justify-center uppercase">
          {props.state.name.slice(0, 2)}
        </span>
      </AvatarContent>
    </Avatar>
  );
};

const Avatars: Component = () => {
  const presence = usePlayerPresence();

  const playerIds = createMemo(() => {
    return Object.keys(presence.players);
  });

  return (
    <AvatarGroup>
      <For each={playerIds()}>
        {(playerId) => (
          <Show when={presence.players[playerId]}>
            {(state) => <PlayerAvatar state={state()} />}
          </Show>
        )}
      </For>
    </AvatarGroup>
  );
};

type TopBarProps = {
  board: BoardModel;
  boardAccess: BoardAccess;
};

export const TopBar: Component<TopBarProps> = (props) => {
  const session = useSessionContext();

  return (
    <div class="absolute inset-x-auto right-4 top-4 flex w-min items-center gap-4 rounded-3xl bg-base-300 p-1 shadow-lg">
      <div class="flex flex-col gap-2 p-1 pl-4">
        <div class="flex items-center gap-2">
          <h1 class="grow font-bold">{props.board.name}</h1>
          <Show when={props.board.owner_id === session()?.user.id}>
            <SettingsDialog boardId={props.board.id} />
          </Show>
          <ShareButton />
        </div>
        <h2 class="text-sm">{props.board.media}</h2>
      </div>
      <div>
        <Avatars />
      </div>
    </div>
  );
};

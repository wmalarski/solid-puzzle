import { type Component, Show } from "solid-js";

import type { BoardModel } from "~/server/board/types";
import type { BoardAccess } from "~/server/share/db";

import { Avatar, AvatarContent, AvatarGroup } from "~/components/Avatar";
import { useSessionContext } from "~/contexts/SessionContext";

import { SettingsDialog } from "./SettingsDialog";
import { SharePopover } from "./SharePopover";

const Avatars: Component = () => {
  return (
    <AvatarGroup>
      <Avatar>
        <AvatarContent placeholder ring="secondary" size="xs">
          <span>A</span>
        </AvatarContent>
      </Avatar>
      <Avatar>
        <AvatarContent placeholder ring="primary" size="xs">
          <span>B</span>
        </AvatarContent>
      </Avatar>
      <Avatar>
        <AvatarContent placeholder ring="accent" size="xs">
          <span>C</span>
        </AvatarContent>
      </Avatar>
      <Avatar placeholder>
        <AvatarContent placeholder size="xs">
          <span>+99</span>
        </AvatarContent>
      </Avatar>
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
      <div class="flex flex-col pl-4">
        <div class="flex items-center gap-2">
          <h1 class="font-bold">{props.board.name}</h1>
          <Show when={props.board.ownerId === session()?.userId}>
            <SettingsDialog boardId={props.board.id} />
          </Show>
          <SharePopover board={props.board} />
        </div>
        <h2 class="text-sm">{props.board.media}</h2>
      </div>
      <div>
        <Avatars />
      </div>
    </div>
  );
};

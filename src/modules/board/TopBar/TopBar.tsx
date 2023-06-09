import type { Component } from "solid-js";
import { Avatar, AvatarContent, AvatarGroup } from "~/components/Avatar";
import type { BoardModel } from "~/db/types";
import { SharePopover } from "./SharePopover";

const Avatars: Component = () => {
  return (
    <AvatarGroup>
      <Avatar>
        <AvatarContent size="xs" placeholder ring="secondary">
          <span>A</span>
        </AvatarContent>
      </Avatar>
      <Avatar>
        <AvatarContent size="xs" placeholder ring="primary">
          <span>B</span>
        </AvatarContent>
      </Avatar>
      <Avatar>
        <AvatarContent size="xs" placeholder ring="accent">
          <span>C</span>
        </AvatarContent>
      </Avatar>
      <Avatar placeholder>
        <AvatarContent size="xs" placeholder>
          <span>+99</span>
        </AvatarContent>
      </Avatar>
    </AvatarGroup>
  );
};

type TopBarProps = {
  board: BoardModel;
};

export const TopBar: Component<TopBarProps> = (props) => {
  return (
    <div class="absolute inset-x-auto right-4 top-4 flex w-min items-center gap-4 rounded-3xl bg-neutral-100 p-1 shadow-lg">
      <div class="flex flex-col pl-4">
        <div class="flex items-center gap-2">
          <h1 class="font-bold">{props.board.name}</h1>
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

import type { Component } from "solid-js";
import { Avatar, AvatarContent, AvatarGroup } from "~/components/Avatar";
import { Navbar, NavbarEnd, NavbarStart } from "~/components/Navbar";
import type { BoardDetails, RoomDetails } from "~/services/types";

const Avatars: Component = () => {
  return (
    <AvatarGroup>
      <Avatar>
        <AvatarContent ring="secondary">
          <span>A</span>
        </AvatarContent>
      </Avatar>
      <Avatar>
        <AvatarContent ring="primary">
          <span>B</span>
        </AvatarContent>
      </Avatar>
      <Avatar>
        <AvatarContent ring="accent">
          <span>C</span>
        </AvatarContent>
      </Avatar>
      <Avatar placeholder>
        <AvatarContent placeholder>
          <span>+99</span>
        </AvatarContent>
      </Avatar>
    </AvatarGroup>
  );
};

type TopNavbarProps = {
  board: BoardDetails;
  room: RoomDetails;
};

export const TopNavbar: Component<TopNavbarProps> = (props) => {
  return (
    <Navbar class="absolute top-4 bg-neutral-200 p-4">
      <NavbarStart>
        <h1>{props.room.name}</h1>
        <h2>{props.board.title}</h2>
      </NavbarStart>
      <NavbarEnd>
        <Avatars />
      </NavbarEnd>
    </Navbar>
  );
};

import type { Component } from "solid-js";
import { Navbar, NavbarEnd, NavbarStart } from "~/components/Navbar";
import type { BoardDetails, RoomDetails } from "~/services/types";

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
      <NavbarEnd>Avatars</NavbarEnd>
    </Navbar>
  );
};

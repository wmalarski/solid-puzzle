import { For, type Component, type JSX } from "solid-js";
import type { BoardModel } from "~/db/types";

export const BoardsListRoot: Component<JSX.IntrinsicElements["div"]> = (
  props
) => {
  return <div {...props} />;
};

const RemoveButton: Component = () => {
  return null;
};

const UpdateButton: Component = () => {
  return null;
};

type BoardItemProps = {
  board: BoardModel;
};

const BoardItem: Component<BoardItemProps> = (props) => {
  return (
    <div>
      <span>Name</span>
      <span>{props.board.name}</span>
      <span>Media</span>
      <span>{props.board.media}</span>
      <RemoveButton />
      <UpdateButton />
    </div>
  );
};

type BoardsListProps = {
  boards: BoardModel[];
};

export const BoardsList: Component<BoardsListProps> = (props) => {
  return (
    <For each={props.boards}>{(board) => <BoardItem board={board} />}</For>
  );
};

export const BoardsListError: Component = () => {
  return <pre>Error</pre>;
};

export const BoardsListLoading: Component = () => {
  return <pre>Loading</pre>;
};

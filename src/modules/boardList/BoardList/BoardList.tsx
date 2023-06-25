import { For, type Component, type JSX } from "solid-js";
import type { BoardModel } from "~/db/types";

export const BoardsListRoot: Component<JSX.IntrinsicElements["div"]> = (
  props
) => {
  return <div {...props} />;
};

type BoardsListProps = {
  boards: BoardModel[];
};

export const BoardsList: Component<BoardsListProps> = (props) => {
  return (
    <For each={props.boards}>
      {(board) => <pre>{JSON.stringify(board, null, 2)}</pre>}
    </For>
  );
};

export const BoardsListError: Component = () => {
  return <pre>Error</pre>;
};

export const BoardsListLoading: Component = () => {
  return <pre>Loading</pre>;
};

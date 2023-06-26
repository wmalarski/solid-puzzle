import { createQuery } from "@tanstack/solid-query";
import {
  ErrorBoundary,
  For,
  Suspense,
  type Component,
  type JSX,
} from "solid-js";
import type { BoardModel } from "~/db/types";
import { getBoardsKey, getBoardsServerQuery } from "~/server/board";

const BoardsListRoot: Component<JSX.IntrinsicElements["div"]> = (props) => {
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

const BoardsListError: Component = () => {
  return <pre>Error</pre>;
};

const BoardsListLoading: Component = () => {
  return <pre>Loading</pre>;
};

const BoardsQuery: Component = () => {
  const boardQuery = createQuery(() => ({
    queryFn: (context) => getBoardsServerQuery(context.queryKey),
    queryKey: getBoardsKey({ limit: 10, offset: 0 }),
    suspense: true,
  }));

  return (
    <For each={boardQuery.data}>{(board) => <BoardItem board={board} />}</For>
  );
};

export default function BoardsList() {
  return (
    <BoardsListRoot>
      <ErrorBoundary fallback={<BoardsListError />}>
        <Suspense fallback={<BoardsListLoading />}>
          <BoardsQuery />
        </Suspense>
      </ErrorBoundary>
    </BoardsListRoot>
  );
}

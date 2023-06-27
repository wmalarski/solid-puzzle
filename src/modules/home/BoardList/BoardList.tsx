import { createQuery } from "@tanstack/solid-query";
import { ErrorBoundary, For, Show, Suspense, type Component } from "solid-js";
import { LinkButton } from "~/components/Button";
import { Card, CardActions, CardBody, CardTitle } from "~/components/Card";
import type { BoardModel } from "~/db/types";
import {
  selectBoardsKey,
  selectBoardsServerQuery,
} from "~/server/board/actions";
import { paths } from "~/utils/paths";

type BoardItemProps = {
  board: BoardModel;
};

const BoardItem: Component<BoardItemProps> = (props) => {
  return (
    <Card variant="bordered" size="compact">
      <Show when={props.board.media}>
        {(src) => (
          <figure>
            <img src={src()} alt="board" />
          </figure>
        )}
      </Show>
      <CardBody>
        <CardTitle component="h3">{props.board.name}</CardTitle>
        <CardActions justify="end">
          <LinkButton size="sm" href={paths.board(props.board.id)}>
            {props.board.name}
          </LinkButton>
        </CardActions>
      </CardBody>
    </Card>
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
    queryFn: (context) => selectBoardsServerQuery(context.queryKey),
    queryKey: selectBoardsKey({ limit: 10, offset: 0 }),
    suspense: true,
  }));

  return (
    <For each={boardQuery.data}>{(board) => <BoardItem board={board} />}</For>
  );
};

export default function BoardsList() {
  return (
    <section class="flex gap-1">
      <ErrorBoundary fallback={<BoardsListError />}>
        <Suspense fallback={<BoardsListLoading />}>
          <BoardsQuery />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}

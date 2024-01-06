import { createQuery } from "@tanstack/solid-query";
import { ErrorBoundary, For, Show, Suspense, type Component } from "solid-js";
import { LinkButton } from "~/components/Button";
import { Card, CardActions, CardBody, CardTitle } from "~/components/Card";
import { useI18n } from "~/contexts/I18nContext";
import {
  SELECT_BOARDS_DEFAULT_LIMIT,
  selectBoardsQueryOptions,
} from "~/server/board/client";
import type { BoardModel } from "~/server/board/types";
import { paths } from "~/utils/paths";

type BoardItemProps = {
  board: BoardModel;
};

const BoardItem: Component<BoardItemProps> = (props) => {
  const { t } = useI18n();

  return (
    <Card variant="bordered" size="compact" bg="base-300">
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
            {t("list.go")}
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

const BoardsListEmpty: Component = () => {
  return <pre>Empty</pre>;
};

export default function BoardsList() {
  const boardQuery = createQuery(() =>
    selectBoardsQueryOptions({
      limit: SELECT_BOARDS_DEFAULT_LIMIT,
      offset: 0,
    })(),
  );

  return (
    <section class="flex gap-1">
      <ErrorBoundary fallback={<BoardsListError />}>
        <Suspense fallback={<BoardsListLoading />}>
          <Show
            when={
              boardQuery.status === "success" &&
              boardQuery.data &&
              boardQuery.data.length > 0
            }
            fallback={<BoardsListEmpty />}
          >
            <For each={boardQuery.data}>
              {(board) => <BoardItem board={board} />}
            </For>
          </Show>
        </Suspense>
      </ErrorBoundary>
    </section>
  );
}

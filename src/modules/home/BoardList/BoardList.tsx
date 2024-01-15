import { createQuery } from "@tanstack/solid-query";
import { type Component, ErrorBoundary, For, Show, Suspense } from "solid-js";

import type { BoardModel } from "~/types/models";

import { LinkButton } from "~/components/Button";
import { Card, CardActions, CardBody, CardTitle } from "~/components/Card";
import { useI18n } from "~/contexts/I18nContext";
import { selectBoardsQueryOptions } from "~/services/board";
import { paths } from "~/utils/paths";

type BoardItemProps = {
  board: Omit<BoardModel, "config">;
};

const BoardItem: Component<BoardItemProps> = (props) => {
  const { t } = useI18n();

  return (
    <Card bg="base-300" size="compact" variant="bordered">
      <Show when={props.board.media}>
        {(src) => (
          <figure>
            <img alt="board" src={src()} />
          </figure>
        )}
      </Show>
      <CardBody>
        <CardTitle component="h3">{props.board.name}</CardTitle>
        <CardActions justify="end">
          <LinkButton href={paths.board(props.board.id)} size="sm">
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
    selectBoardsQueryOptions({ offset: 0 })(),
  );

  return (
    <section class="flex gap-1">
      <ErrorBoundary fallback={<BoardsListError />}>
        <Suspense fallback={<BoardsListLoading />}>
          <Show
            fallback={<BoardsListEmpty />}
            when={
              boardQuery.status === "success" &&
              boardQuery.data &&
              boardQuery.data.length > 0
            }
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

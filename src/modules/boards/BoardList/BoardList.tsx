import { type Component, For, Show } from "solid-js";

import type { BoardModelWithoutConfig } from "~/types/models";

import { LinkButton } from "~/components/Button";
import { Card, CardActions, CardBody, CardTitle } from "~/components/Card";
import { ArrowRightIcon } from "~/components/Icons/ArrowRightIcon";
import { SettingsIcon } from "~/components/Icons/SettingsIcon";
import { TrashIcon } from "~/components/Icons/TrashIcon";
import { useI18n } from "~/contexts/I18nContext";
import { paths } from "~/utils/paths";

import { DeleteBoardUncontrolledDialog } from "../DeleteDialog";
import { SettingsUncontrolledDialog } from "../SettingsDialog";

type BoardItemProps = {
  board: BoardModelWithoutConfig;
};

const BoardItem: Component<BoardItemProps> = (props) => {
  const { t } = useI18n();

  return (
    <Card bg="base-300" class="w-96" size="compact" variant="bordered">
      <Show when={props.board.media}>
        {(src) => (
          <figure>
            <img alt="board" class="max-w-96" src={src()} />
          </figure>
        )}
      </Show>
      <CardBody>
        <CardTitle component="h3">{props.board.name}</CardTitle>
        <CardActions justify="end">
          <DeleteBoardUncontrolledDialog
            boardId={props.board.id}
            color="error"
            size="sm"
            variant="outline"
          >
            <TrashIcon class="size-4" />
            {t("board.settings.delete.button")}
          </DeleteBoardUncontrolledDialog>
          <SettingsUncontrolledDialog board={props.board} size="sm">
            <SettingsIcon class="size-4" />
            {t("board.settings.label")}
          </SettingsUncontrolledDialog>
          <LinkButton href={paths.board(props.board.id)} size="sm">
            <ArrowRightIcon class="size-4" />
            {t("list.go")}
          </LinkButton>
        </CardActions>
      </CardBody>
    </Card>
  );
};

type BoardsListErrorProps = {
  error: unknown;
};

export const BoardsListError: Component<BoardsListErrorProps> = (props) => {
  return (
    <div>
      Error<pre>{JSON.stringify(props.error, null, 2)}</pre>
    </div>
  );
};

export const BoardsListLoading: Component = () => {
  return <pre>Loading</pre>;
};

const BoardsListEmpty: Component = () => {
  return <pre>Empty</pre>;
};

type BoardsListProps = {
  boards: BoardModelWithoutConfig[];
};

export const BoardsList: Component<BoardsListProps> = (props) => {
  return (
    <section class="mx-auto max-w-screen-xl p-6">
      <Show fallback={<BoardsListEmpty />} when={props.boards.length > 0}>
        <div class="flex flex-wrap gap-3">
          <For each={props.boards}>
            {(board) => <BoardItem board={board} />}
          </For>
        </div>
      </Show>
    </section>
  );
};

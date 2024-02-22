import { useSubmission } from "@solidjs/router";
import { type Component, For, Show } from "solid-js";

import type { BoardModelWithoutConfig } from "~/types/models";

import { LinkButton } from "~/components/Button";
import { Card, CardActions, CardBody, CardTitle } from "~/components/Card";
import { ArrowRightIcon } from "~/components/Icons/ArrowRightIcon";
import { SettingsIcon } from "~/components/Icons/SettingsIcon";
import { TrashIcon } from "~/components/Icons/TrashIcon";
import {
  SimplePaginationNext,
  SimplePaginationPrevious,
  SimplePaginationRoot,
  SimplePaginationValue
} from "~/components/SimplePagination";
import { useI18n } from "~/contexts/I18nContext";
import {
  type SelectBoardsLoaderReturn,
  deleteBoardAction
} from "~/server/board/client";
import { paths } from "~/utils/paths";

import { DeleteBoardUncontrolledDialog } from "../DeleteDialog";
import { SettingsUncontrolledDialog } from "../SettingsDialog";

type BoardItemProps = {
  board: BoardModelWithoutConfig;
};

const BoardItem: Component<BoardItemProps> = (props) => {
  const { t } = useI18n();

  const deleteSubmission = useSubmission(
    deleteBoardAction,
    ([form]) => form.get("id") === props.board.id
  );

  return (
    <Show when={!deleteSubmission.pending}>
      <Card bg="base-200" class="w-96" size="compact" variant="bordered">
        <Show when={props.board.media}>
          {(src) => (
            <figure>
              <img alt="board" class="max-w-96" src={src()} />
            </figure>
          )}
        </Show>
        <CardBody>
          <CardTitle component="h3">{props.board.name}</CardTitle>
          <span class="text-nowrap text-sm">{props.board.media}</span>
          <span class="text-nowrap text-sm opacity-80">{`${props.board.columns} x ${props.board.rows}`}</span>
          <CardActions justify="end">
            <DeleteBoardUncontrolledDialog
              boardId={props.board.id}
              color="error"
              size="sm"
            >
              <TrashIcon class="size-4" />
              {t("board.settings.delete.button")}
            </DeleteBoardUncontrolledDialog>
            <SettingsUncontrolledDialog board={props.board} size="sm">
              <SettingsIcon class="size-4" />
              {t("board.settings.label")}
            </SettingsUncontrolledDialog>
            <LinkButton
              color="secondary"
              href={paths.board(props.board.id)}
              size="sm"
            >
              <ArrowRightIcon class="size-4" />
              {t("list.go")}
            </LinkButton>
          </CardActions>
        </CardBody>
      </Card>
    </Show>
  );
};

export const BoardsListLoading: Component = () => {
  const { t } = useI18n();

  return <pre>{t("list.loading")}</pre>;
};

const BoardsListEmpty: Component = () => {
  const { t } = useI18n();

  return <pre>{t("list.empty")}</pre>;
};

type ListPaginationProps = {
  count: number;
  page: number;
};

const ListPagination: Component<ListPaginationProps> = (props) => {
  return (
    <SimplePaginationRoot count={props.count} page={props.page}>
      <SimplePaginationPrevious href={paths.boards(props.page)} />
      <SimplePaginationValue>{props.page + 1}</SimplePaginationValue>
      <SimplePaginationNext href={paths.boards(props.page + 2)} />
    </SimplePaginationRoot>
  );
};

type BoardsListProps = {
  boards: SelectBoardsLoaderReturn;
  limit: number;
  page: number;
};

export const BoardsList: Component<BoardsListProps> = (props) => {
  return (
    <section class="mx-auto flex max-w-screen-xl flex-col gap-4 p-6">
      <Show fallback={<BoardsListEmpty />} when={props.boards.data.length > 0}>
        <div class="flex flex-wrap gap-3">
          <For each={props.boards.data}>
            {(board) => <BoardItem board={board} />}
          </For>
        </div>
      </Show>
      <ListPagination
        count={(props.boards.count || 0) / props.limit}
        page={props.page}
      />
    </section>
  );
};

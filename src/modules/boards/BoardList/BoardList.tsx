import { useSubmission } from "@solidjs/router";
import { Component, For, Show } from "solid-js";

import type { BoardModelWithoutConfig } from "~/types/models";

import { LinkButton } from "~/components/Button/Button";
import { Card, CardActions, CardBody, CardTitle } from "~/components/Card/Card";
import { ArrowRightIcon } from "~/components/Icons/ArrowRightIcon";
import { SettingsIcon } from "~/components/Icons/SettingsIcon";
import { TrashIcon } from "~/components/Icons/TrashIcon";
import {
  SimplePaginationNext,
  SimplePaginationPrevious,
  SimplePaginationRoot,
  SimplePaginationValue
} from "~/components/SimplePagination/SimplePagination";
import { useI18n } from "~/contexts/I18nContext";
import {
  deleteBoardAction,
  type SelectBoardsLoaderReturn
} from "~/server/board/client";
import { paths } from "~/utils/paths";

import { DeleteBoardUncontrolledDialog } from "../DeleteDialog/DeleteDialog";
import { SettingsUncontrolledDialog } from "../SettingsDialog/SettingsDialog";

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
              {t("settings.delete.button")}
            </DeleteBoardUncontrolledDialog>
            <SettingsUncontrolledDialog board={props.board} size="sm">
              <SettingsIcon class="size-4" />
              {t("settings.label")}
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
  return <div />;
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

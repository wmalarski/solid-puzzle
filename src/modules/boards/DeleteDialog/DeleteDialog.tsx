import { useAction, useSubmission } from "@solidjs/router";
import { useQueryClient } from "@tanstack/solid-query";
import {
  type Component,
  type ComponentProps,
  Show,
  splitProps
} from "solid-js";

import type { DialogTriggerProps } from "~/components/Dialog";

import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import {
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger
} from "~/components/Dialog";
import { XIcon } from "~/components/Icons/XIcon";
import { useI18n } from "~/contexts/I18nContext";
import {
  deleteBoardAction,
  invalidateSelectBoardsQueries
} from "~/server/board/client";

type DeleteBoardFormProps = {
  boardId: string;
  onSuccess?: VoidFunction;
};

const DeleteBoardForm: Component<DeleteBoardFormProps> = (props) => {
  const { t } = useI18n();

  const queryClient = useQueryClient();

  const submission = useSubmission(deleteBoardAction);
  const action = useAction(deleteBoardAction);

  const onSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();
    try {
      await action(new FormData(event.currentTarget));
      await queryClient.invalidateQueries(invalidateSelectBoardsQueries());

      props.onSuccess?.();
    } catch {
      // handled by useSubmission
    }
  };

  return (
    <form class="flex flex-col gap-4" method="post" onSubmit={onSubmit}>
      <Show when={submission.result?.error}>
        <Alert variant="error">
          <AlertIcon variant="error" />
          {submission.result?.error}
        </Alert>
      </Show>
      <input name="id" type="hidden" value={props.boardId} />
      <footer class="flex w-full gap-4">
        <DialogCloseButton type="button">
          {t("board.settings.delete.cancel")}
        </DialogCloseButton>
        <Button
          disabled={submission.pending}
          isLoading={submission.pending}
          type="submit"
        >
          {t("board.settings.delete.button")}
        </Button>
      </footer>
    </form>
  );
};

type DeleteBoardProps = {
  boardId: string;
  onSuccess?: VoidFunction;
};

const DeleteBoard: Component<DeleteBoardProps> = (props) => {
  const { t } = useI18n();

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPositioner>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("board.settings.delete.title")}</DialogTitle>
            <DialogCloseButton>
              <XIcon />
            </DialogCloseButton>
          </DialogHeader>
          <DeleteBoardForm
            boardId={props.boardId}
            onSuccess={props.onSuccess}
          />
        </DialogContent>
      </DialogPositioner>
    </DialogPortal>
  );
};

type DeleteBoardControlledDialogProps = {
  boardId: string;
  isOpen: boolean;
  onIsOpenChange: (isOpen: boolean) => void;
  onSuccess: VoidFunction;
};

export const DeleteBoardControlledDialog: Component<
  DeleteBoardControlledDialogProps
> = (props) => {
  return (
    <DialogRoot onOpenChange={props.onIsOpenChange} open={props.isOpen}>
      <DeleteBoard boardId={props.boardId} onSuccess={props.onSuccess} />
    </DialogRoot>
  );
};

type DeleteBoardUncontrolledDialogProps = DialogTriggerProps & {
  boardId: string;
  onSuccess?: VoidFunction;
};

export const DeleteBoardUncontrolledDialog: Component<
  DeleteBoardUncontrolledDialogProps
> = (props) => {
  const [split, rest] = splitProps(props, ["boardId", "onSuccess"]);

  return (
    <DialogRoot>
      <DialogTrigger {...rest} />
      <DeleteBoard boardId={split.boardId} onSuccess={split.onSuccess} />
    </DialogRoot>
  );
};

import { useSubmission } from "@solidjs/router";
import { type Component, Show, splitProps } from "solid-js";

import type { DialogTriggerProps } from "~/components/Dialog";

import { Alert, AlertIcon } from "~/components/Alert";
import {
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogPositioner,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger
} from "~/components/AlertDialog";
import { Button } from "~/components/Button";
import { XIcon } from "~/components/Icons/XIcon";
import { useI18n } from "~/contexts/I18nContext";
import { deleteBoardAction } from "~/server/board/client";

type DeleteBoardFormProps = {
  boardId: string;
  onSuccess?: VoidFunction;
};

const DeleteBoardForm: Component<DeleteBoardFormProps> = (props) => {
  const { t } = useI18n();

  const submission = useSubmission(deleteBoardAction);

  return (
    <form action={deleteBoardAction} class="flex flex-col gap-4" method="post">
      <Show when={submission.result?.error}>
        <Alert variant="error">
          <AlertIcon variant="error" />
          {submission.result?.error}
        </Alert>
      </Show>
      <input name="id" type="hidden" value={props.boardId} />
      <footer class="flex w-full gap-4">
        <AlertDialogCloseButton type="button">
          {t("board.settings.delete.cancel")}
        </AlertDialogCloseButton>
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
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPositioner>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("board.settings.delete.title")}
            </AlertDialogTitle>
            <AlertDialogCloseButton>
              <XIcon />
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <DeleteBoardForm
            boardId={props.boardId}
            onSuccess={props.onSuccess}
          />
        </AlertDialogContent>
      </AlertDialogPositioner>
    </AlertDialogPortal>
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
    <AlertDialogRoot onOpenChange={props.onIsOpenChange} open={props.isOpen}>
      <DeleteBoard boardId={props.boardId} onSuccess={props.onSuccess} />
    </AlertDialogRoot>
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
    <AlertDialogRoot>
      <AlertDialogTrigger {...rest} />
      <DeleteBoard boardId={split.boardId} onSuccess={split.onSuccess} />
    </AlertDialogRoot>
  );
};

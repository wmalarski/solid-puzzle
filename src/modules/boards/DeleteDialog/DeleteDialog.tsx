import { useSubmission } from "@solidjs/router";
import { Show, splitProps } from "solid-js";

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
import { TrashIcon } from "~/components/Icons/TrashIcon";
import { XIcon } from "~/components/Icons/XIcon";
import { useI18n } from "~/contexts/I18nContext";
import { deleteBoardAction } from "~/server/board/client";

type DeleteBoardFormProps = {
  boardId: string;
};

function DeleteBoardForm(props: DeleteBoardFormProps) {
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
      <span>{t("settings.delete.label")}</span>
      <footer class="flex w-full gap-4">
        <AlertDialogCloseButton type="button">
          {t("settings.delete.cancel")}
        </AlertDialogCloseButton>
        <Button
          color="error"
          disabled={submission.pending}
          isLoading={submission.pending}
          type="submit"
        >
          <TrashIcon class="size-4" />
          {t("settings.delete.button")}
        </Button>
      </footer>
    </form>
  );
}

type DeleteBoardProps = {
  boardId: string;
};

function DeleteBoard(props: DeleteBoardProps) {
  const { t } = useI18n();

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPositioner>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("settings.delete.title")}</AlertDialogTitle>
            <AlertDialogCloseButton shape="circle">
              <XIcon />
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <DeleteBoardForm boardId={props.boardId} />
        </AlertDialogContent>
      </AlertDialogPositioner>
    </AlertDialogPortal>
  );
}

type DeleteBoardControlledDialogProps = {
  boardId: string;
  isOpen: boolean;
  onIsOpenChange: (isOpen: boolean) => void;
};

export function DeleteBoardControlledDialog(
  props: DeleteBoardControlledDialogProps
) {
  return (
    <AlertDialogRoot onOpenChange={props.onIsOpenChange} open={props.isOpen}>
      <DeleteBoard boardId={props.boardId} />
    </AlertDialogRoot>
  );
}

type DeleteBoardUncontrolledDialogProps = {
  boardId: string;
} & DialogTriggerProps;

export function DeleteBoardUncontrolledDialog(
  props: DeleteBoardUncontrolledDialogProps
) {
  const [split, rest] = splitProps(props, ["boardId"]);

  return (
    <AlertDialogRoot>
      <AlertDialogTrigger {...rest} />
      <DeleteBoard boardId={split.boardId} />
    </AlertDialogRoot>
  );
}

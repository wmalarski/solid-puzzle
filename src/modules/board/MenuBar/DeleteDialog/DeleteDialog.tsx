import { useAction, useSubmission } from "@solidjs/router";
import { useQueryClient } from "@tanstack/solid-query";
import { type Component, type ComponentProps, Show } from "solid-js";

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
  DialogTitle
} from "~/components/Dialog";
import { XIcon } from "~/components/Icons/XIcon";
import { useI18n } from "~/contexts/I18nContext";
import {
  deleteBoardAction,
  invalidateSelectBoardsQueries
} from "~/server/board/client";

type DeleteBoardFormProps = {
  boardId: string;
  onCancelClick: VoidFunction;
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
        <Button onClick={props.onCancelClick} type="button" variant="ghost">
          {t("board.settings.delete.cancel")}
        </Button>
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

type DeleteBoardDialogProps = {
  boardId: string;
  isOpen: boolean;
  onIsOpenChange: (isOpen: boolean) => void;
};

export const DeleteBoardDialog: Component<DeleteBoardDialogProps> = (props) => {
  const { t } = useI18n();

  const onCancelClick = () => {
    props.onIsOpenChange(false);
  };

  return (
    <DialogRoot onOpenChange={props.onIsOpenChange} open={props.isOpen}>
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
              onCancelClick={onCancelClick}
            />
          </DialogContent>
        </DialogPositioner>
      </DialogPortal>
    </DialogRoot>
  );
};

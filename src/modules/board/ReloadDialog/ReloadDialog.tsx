import { createWritableMemo } from "@solid-primitives/memo";
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
  invalidateSelectBoardQuery,
  reloadBoardAction
} from "~/server/board/client";

import { usePuzzleStore } from "../DataProviders/PuzzleProvider";

type ReloadFormProps = {
  boardId: string;
  onSuccess: VoidFunction;
};

export const ReloadForm: Component<ReloadFormProps> = (props) => {
  const { t } = useI18n();

  const queryClient = useQueryClient();

  const submission = useSubmission(reloadBoardAction);
  const action = useAction(reloadBoardAction);

  const onSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();
    try {
      await action(new FormData(event.currentTarget));
      await queryClient.invalidateQueries(
        invalidateSelectBoardQuery(props.boardId)
      );

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
          Error
        </Alert>
      </Show>
      <input name="id" type="hidden" value={props.boardId} />
      <Button
        disabled={submission.pending}
        isLoading={submission.pending}
        type="submit"
      >
        {t("board.settings.update.button")}
      </Button>
    </form>
  );
};

type ReloadDialogProps = {
  boardId: string;
};

export const ReloadDialog: Component<ReloadDialogProps> = (props) => {
  const { t } = useI18n();

  const store = usePuzzleStore();

  const [isOpen, setIsOpen] = createWritableMemo(store.isFinished);

  const onSuccess = () => {
    setIsOpen(false);
  };

  return (
    <DialogRoot onOpenChange={setIsOpen} open={isOpen()}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("board.settings.title")}</DialogTitle>
              <DialogCloseButton>
                <XIcon />
              </DialogCloseButton>
            </DialogHeader>
            <ReloadForm boardId={props.boardId} onSuccess={onSuccess} />
          </DialogContent>
        </DialogPositioner>
      </DialogPortal>
    </DialogRoot>
  );
};

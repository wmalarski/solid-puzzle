import { createWritableMemo } from "@solid-primitives/memo";
import { useSubmission } from "@solidjs/router";
import { type Component, Show } from "solid-js";

import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import {
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogPositioner,
  DialogRoot,
  DialogTitle
} from "~/components/Dialog";
import { XIcon } from "~/components/Icons/XIcon";
import { useI18n } from "~/contexts/I18nContext";
import { reloadBoardAction } from "~/server/board/client";

import { usePuzzleStore } from "../DataProviders/PuzzleProvider";

type ReloadFormProps = {
  boardId: string;
  onSuccess: VoidFunction;
};

export const ReloadForm: Component<ReloadFormProps> = (props) => {
  const { t } = useI18n();

  const submission = useSubmission(reloadBoardAction);

  return (
    <form action={reloadBoardAction} class="flex flex-col gap-4" method="post">
      <Show when={submission.result?.error}>
        <Alert variant="error">
          <AlertIcon variant="error" />
          {t("board.reload.error")}
        </Alert>
      </Show>
      <input name="id" type="hidden" value={props.boardId} />
      <Button
        disabled={submission.pending}
        isLoading={submission.pending}
        type="submit"
      >
        {t("board.reload.startAgain")}
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
              <DialogTitle>{t("board.reload.title")}</DialogTitle>
              <DialogDescription>
                {t("board.reload.description")}
              </DialogDescription>
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

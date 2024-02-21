import type { ComponentProps } from "solid-js";

import { createWritableMemo } from "@solid-primitives/memo";
import { useAction, useSubmission } from "@solidjs/router";
import { type Component, Show } from "solid-js";

import { Alert, AlertIcon } from "~/components/Alert";
import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogPositioner,
  AlertDialogRoot,
  AlertDialogTitle
} from "~/components/AlertDialog";
import { Button, LinkButton } from "~/components/Button";
import { useI18n } from "~/contexts/I18nContext";
import { reloadBoardAction } from "~/server/board/client";
import { paths } from "~/utils/paths";

import { usePuzzleStore } from "../DataProviders/PuzzleProvider";

type ReloadFormProps = {
  boardId: string;
  onSuccess: VoidFunction;
};

export const ReloadForm: Component<ReloadFormProps> = (props) => {
  const { t } = useI18n();

  const submission = useSubmission(reloadBoardAction);
  const action = useAction(reloadBoardAction);

  const onSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    try {
      await action(new FormData(event.currentTarget));
      props.onSuccess();
    } catch {
      // handler by useSubmission
    }
  };

  return (
    <form class="flex flex-col gap-4 pt-4" method="post" onSubmit={onSubmit}>
      <Show when={submission.result?.error}>
        <Alert variant="error">
          <AlertIcon variant="error" />
          {t("board.reload.error")}
        </Alert>
      </Show>
      <input name="id" type="hidden" value={props.boardId} />
      <div class="grid w-full grid-cols-2 gap-2">
        <LinkButton href={paths.home}>{t("board.reload.goHome")}</LinkButton>
        <Button
          color="secondary"
          disabled={submission.pending}
          isLoading={submission.pending}
          type="submit"
        >
          {t("board.reload.startAgain")}
        </Button>
      </div>
    </form>
  );
};

type ReloadDialogProps = {
  boardId: string;
};

export const ReloadDialog: Component<ReloadDialogProps> = (props) => {
  const { t } = useI18n();

  const store = usePuzzleStore();

  const [isOpen, setIsOpen] = createWritableMemo(() => store.isFinished());

  const onSuccess = () => {
    setIsOpen(false);
  };

  const onOpenChange = () => {
    //
  };

  return (
    <AlertDialogRoot modal onOpenChange={onOpenChange} open={isOpen()}>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogPositioner>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("board.reload.title")}</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              {t("board.reload.description")}
            </AlertDialogDescription>
            <ReloadForm boardId={props.boardId} onSuccess={onSuccess} />
          </AlertDialogContent>
        </AlertDialogPositioner>
      </AlertDialogPortal>
    </AlertDialogRoot>
  );
};

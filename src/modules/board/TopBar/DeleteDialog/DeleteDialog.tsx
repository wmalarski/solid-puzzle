import { useSubmission } from "@solidjs/router";
import { Show, createSignal, type Component } from "solid-js";
import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import { cardTitleClass } from "~/components/Card";
import {
  DialogCloseButton,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "~/components/Dialog";
import { TrashIcon } from "~/components/Icons/TrashIcon";
import { XIcon } from "~/components/Icons/XIcon";
import { useI18n } from "~/contexts/I18nContext";
import { deleteBoardAction } from "~/server/board/client";

type DeleteBoardFormProps = {
  boardId: string;
  onCancelClick: VoidFunction;
};

const DeleteBoardForm: Component<DeleteBoardFormProps> = (props) => {
  const { t } = useI18n();

  const submission = useSubmission(deleteBoardAction);

  return (
    <form action={deleteBoardAction} class="flex flex-col gap-4">
      <Show when={submission.result}>
        <Alert variant="error">
          <AlertIcon variant="error" />
          Error
        </Alert>
      </Show>
      <input type="hidden" name="id" value={props.boardId} />
      <Button variant="ghost" onClick={props.onCancelClick} type="button">
        {t("board.settings.delete.cancel")}
      </Button>
      <Button
        disabled={submission.pending}
        isLoading={submission.pending}
        type="submit"
      >
        {t("board.settings.delete.button")}
      </Button>
    </form>
  );
};

type FormDialogProps = {
  boardId: string;
};

const FormDialog: Component<FormDialogProps> = (props) => {
  const { t } = useI18n();

  const [isOpen, setIsOpen] = createSignal(false);

  const onCancelClick = () => {
    setIsOpen(false);
  };

  return (
    <DialogRoot open={isOpen()} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <TrashIcon />
        {t("board.settings.delete.button")}
      </DialogTrigger>
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

type DeleteBoardProps = {
  boardId: string;
};

export const DeleteBoard: Component<DeleteBoardProps> = (props) => {
  const { t } = useI18n();

  return (
    <section>
      <header class="flex items-center justify-between gap-2">
        <h2 class={cardTitleClass()}>{t("board.settings.delete.title")}</h2>
      </header>
      <FormDialog boardId={props.boardId} />
    </section>
  );
};

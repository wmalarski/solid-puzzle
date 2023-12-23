import { X, Trash } from "lucide-solid";
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
import { useI18n } from "~/contexts/I18nContext";
import { deleteBoardAction } from "~/server/board/actions";

type DeleteBoardFormProps = {
  boardId: string;
  onCancelClick: VoidFunction;
};

const DeleteBoardForm: Component<DeleteBoardFormProps> = (props) => {
  const { t } = useI18n();

  const [deleteBoard, { Form }] = deleteBoardAction();

  return (
    <Form class="flex flex-col gap-4">
      <Show when={deleteBoard.error}>
        {(error) => (
          <Alert variant="error">
            <AlertIcon variant="error" />
            {error().message}
          </Alert>
        )}
      </Show>
      <input type="hidden" name="id" value={props.boardId} />
      <Button variant="ghost" onClick={props.onCancelClick} type="button">
        {t("board.settings.delete.cancel")}
      </Button>
      <Button
        disabled={deleteBoard.pending}
        isLoading={deleteBoard.pending}
        type="submit"
      >
        {t("board.settings.delete.button")}
      </Button>
    </Form>
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
        <Trash />
        {t("board.settings.delete.button")}
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("board.settings.delete.title")}</DialogTitle>
              <DialogCloseButton>
                <X />
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

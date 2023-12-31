import { useNavigate } from "@solidjs/router";
import { createMutation, useQueryClient } from "@tanstack/solid-query";
import { Show, createSignal, type Component, type JSX } from "solid-js";
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
import { invalidateSelectBoardsQueries } from "~/server/board/client";
import { deleteBoardServerAction } from "~/server/board/rpc";
import { paths } from "~/utils/paths";

type DeleteBoardFormProps = {
  boardId: string;
  onCancelClick: VoidFunction;
};

const DeleteBoardForm: Component<DeleteBoardFormProps> = (props) => {
  const { t } = useI18n();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = createMutation(() => ({
    mutationFn: deleteBoardServerAction,
    onSuccess() {
      navigate(paths.home);

      queryClient.invalidateQueries(invalidateSelectBoardsQueries());
    },
  }));

  const onSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    mutation.mutate(data);
  };

  return (
    <form onSubmit={onSubmit} class="flex flex-col gap-4" method="post">
      <Show when={mutation.error}>
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
        disabled={mutation.isPending}
        isLoading={mutation.isPending}
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

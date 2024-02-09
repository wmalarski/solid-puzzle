import { createMutation, useQueryClient } from "@tanstack/solid-query";
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
  invalidateSelectBoardsQueries
} from "~/server/board/client";
import { updateBoardServerAction } from "~/server/board/rpc";

type ReloadFormProps = {
  boardId: string;
};

export const ReloadForm: Component<ReloadFormProps> = (props) => {
  const { t } = useI18n();

  const queryClient = useQueryClient();

  const mutation = createMutation(() => ({
    mutationFn: updateBoardServerAction,
    onSuccess() {
      queryClient.invalidateQueries(invalidateSelectBoardQuery(props.board.id));
      queryClient.invalidateQueries(invalidateSelectBoardsQueries());
    }
  }));

  const onSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    mutation.mutate(data);
  };

  return (
    <form class="flex flex-col gap-4" method="post" onSubmit={onSubmit}>
      <Show when={mutation.error}>
        <Alert variant="error">
          <AlertIcon variant="error" />
          Error
        </Alert>
      </Show>
      <input name="id" type="hidden" value={props.boardId} />
      <Button
        disabled={mutation.isPending}
        isLoading={mutation.isPending}
        type="submit"
      >
        {t("board.settings.update.button")}
      </Button>
    </form>
  );
};

type FinishedDialogProps = {
  boardId: string;
};

export const FinishedDialog: Component<FinishedDialogProps> = (props) => {
  const { t } = useI18n();

  return (
    <DialogRoot>
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
            <ReloadForm boardId={props.boardId} />
          </DialogContent>
        </DialogPositioner>
      </DialogPortal>
    </DialogRoot>
  );
};

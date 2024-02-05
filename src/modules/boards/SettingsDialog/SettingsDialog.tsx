import { createMutation, useQueryClient } from "@tanstack/solid-query";
import {
  type Component,
  type ComponentProps,
  Show,
  splitProps
} from "solid-js";

import type { DialogTriggerProps } from "~/components/Dialog";

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
  DialogTitle,
  DialogTrigger
} from "~/components/Dialog";
import { XIcon } from "~/components/Icons/XIcon";
import { useI18n } from "~/contexts/I18nContext";
import { ConfigFields } from "~/modules/createBoard/ConfigFields";
import {
  invalidateSelectBoardQuery,
  invalidateSelectBoardsQueries
} from "~/server/board/client";
import { updateBoardServerAction } from "~/server/board/rpc";

type UpdateFormProps = {
  boardId: string;
};

export const UpdateForm: Component<UpdateFormProps> = (props) => {
  const { t } = useI18n();

  const queryClient = useQueryClient();

  const mutation = createMutation(() => ({
    mutationFn: updateBoardServerAction,
    onSuccess() {
      queryClient.invalidateQueries(invalidateSelectBoardQuery(props.boardId));
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
      <ConfigFields />
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

type SettingsDialogProps = {
  boardId: string;
};

const SettingsDialog: Component<SettingsDialogProps> = (props) => {
  const { t } = useI18n();

  return (
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
          <UpdateForm boardId={props.boardId} />
        </DialogContent>
      </DialogPositioner>
    </DialogPortal>
  );
};

type SettingsControlledDialogProps = {
  boardId: string;
  isOpen: boolean;
  onIsOpenChange: (isOpen: boolean) => void;
};

export const SettingsControlledDialog: Component<
  SettingsControlledDialogProps
> = (props) => {
  return (
    <DialogRoot onOpenChange={props.onIsOpenChange} open={props.isOpen}>
      <SettingsDialog boardId={props.boardId} />
    </DialogRoot>
  );
};

type SettingsUncontrolledDialogProps = DialogTriggerProps & {
  boardId: string;
};

export const SettingsUncontrolledDialog: Component<
  SettingsUncontrolledDialogProps
> = (props) => {
  const [split, rest] = splitProps(props, ["boardId"]);

  return (
    <DialogRoot>
      <DialogTrigger {...rest} />
      <SettingsDialog boardId={split.boardId} />
    </DialogRoot>
  );
};

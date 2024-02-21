import type { ComponentProps } from "solid-js";

import { useAction, useSubmission } from "@solidjs/router";
import { type Component, Show, splitProps } from "solid-js";

import type { DialogTriggerProps } from "~/components/Dialog";
import type { BoardModelWithoutConfig } from "~/types/models";

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
import { updateBoardAction } from "~/server/board/client";

type UpdateFormProps = {
  board: BoardModelWithoutConfig;
  onSuccess?: VoidFunction;
};

export const UpdateForm: Component<UpdateFormProps> = (props) => {
  const { t } = useI18n();

  const submission = useSubmission(updateBoardAction);
  const action = useAction(updateBoardAction);

  const onSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    try {
      await action(new FormData(event.currentTarget));
      props.onSuccess?.();
    } catch {
      // handler by useSubmission
    }
  };

  return (
    <form class="flex flex-col gap-4" method="post" onSubmit={onSubmit}>
      <Show when={submission.result?.error}>
        <Alert variant="error">
          <AlertIcon variant="error" />
          {t("board.settings.error")}
        </Alert>
      </Show>
      <input name="id" type="hidden" value={props.board.id} />
      <div class="max-h-[70vh] overflow-y-auto pr-2">
        <ConfigFields
          disabled={submission.pending}
          initialValues={{
            columns: props.board.columns,
            image: props.board.media,
            name: props.board.name,
            rows: props.board.rows
          }}
          scrollableImageGrid={false}
        />
      </div>
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

type SettingsDialogProps = {
  board: BoardModelWithoutConfig;
  onSuccess?: VoidFunction;
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
          <UpdateForm board={props.board} onSuccess={props.onSuccess} />
        </DialogContent>
      </DialogPositioner>
    </DialogPortal>
  );
};

type SettingsControlledDialogProps = {
  board: BoardModelWithoutConfig;
  isOpen: boolean;
  onIsOpenChange: (isOpen: boolean) => void;
};

export const SettingsControlledDialog: Component<
  SettingsControlledDialogProps
> = (props) => {
  const onSuccess = () => {
    props.onIsOpenChange(false);
  };

  return (
    <DialogRoot onOpenChange={props.onIsOpenChange} open={props.isOpen}>
      <SettingsDialog board={props.board} onSuccess={onSuccess} />
    </DialogRoot>
  );
};

type SettingsUncontrolledDialogProps = DialogTriggerProps & {
  board: BoardModelWithoutConfig;
  onSuccess?: VoidFunction;
};

export const SettingsUncontrolledDialog: Component<
  SettingsUncontrolledDialogProps
> = (props) => {
  const [split, rest] = splitProps(props, ["board"]);

  return (
    <DialogRoot>
      <DialogTrigger {...rest} />
      <SettingsDialog board={split.board} onSuccess={props.onSuccess} />
    </DialogRoot>
  );
};

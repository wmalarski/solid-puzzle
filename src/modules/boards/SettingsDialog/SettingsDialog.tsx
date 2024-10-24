import type { Component, ComponentProps } from "solid-js";

import { useAction, useSubmission } from "@solidjs/router";
import { Show, splitProps } from "solid-js";

import type { DialogTriggerProps } from "~/components/Dialog/Dialog";
import type { BoardModelWithoutConfig } from "~/types/models";

import { Alert, AlertIcon } from "~/components/Alert/Alert";
import { Button } from "~/components/Button/Button";
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
} from "~/components/Dialog/Dialog";
import { XIcon } from "~/components/Icons/XIcon";
import { useI18n } from "~/contexts/I18nContext";
import { ConfigFields } from "~/modules/createBoard/ConfigFields/ConfigFields";
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
          {t("settings.error")}
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
          showName
        />
      </div>
      <Button
        disabled={submission.pending}
        isLoading={submission.pending}
        type="submit"
      >
        {t("settings.update.button")}
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
            <DialogTitle>{t("settings.title")}</DialogTitle>
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
  onSuccess: VoidFunction;
};

export const SettingsControlledDialog: Component<
  SettingsControlledDialogProps
> = (props) => {
  const onSuccess = () => {
    props.onIsOpenChange(false);
    props.onSuccess();
  };

  return (
    <DialogRoot onOpenChange={props.onIsOpenChange} open={props.isOpen}>
      <SettingsDialog board={props.board} onSuccess={onSuccess} />
    </DialogRoot>
  );
};

type SettingsUncontrolledDialogProps = {
  board: BoardModelWithoutConfig;
  onSuccess?: VoidFunction;
} & DialogTriggerProps;

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

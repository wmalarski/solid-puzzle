import { useSubmission } from "@solidjs/router";
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
};

export const UpdateForm: Component<UpdateFormProps> = (props) => {
  const { t } = useI18n();

  const submission = useSubmission(updateBoardAction);

  return (
    <form action={updateBoardAction} class="flex flex-col gap-4" method="post">
      <Show when={submission.result?.error}>
        <Alert variant="error">
          <AlertIcon variant="error" />
          {t("board.settings.error")}
        </Alert>
      </Show>
      <input name="id" type="hidden" value={props.board.id} />
      <ConfigFields
        initialValues={{
          columns: props.board.columns,
          image: props.board.media,
          name: props.board.name,
          rows: props.board.rows
        }}
      />
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
          <UpdateForm board={props.board} />
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
  return (
    <DialogRoot onOpenChange={props.onIsOpenChange} open={props.isOpen}>
      <SettingsDialog board={props.board} />
    </DialogRoot>
  );
};

type SettingsUncontrolledDialogProps = DialogTriggerProps & {
  board: BoardModelWithoutConfig;
};

export const SettingsUncontrolledDialog: Component<
  SettingsUncontrolledDialogProps
> = (props) => {
  const [split, rest] = splitProps(props, ["board"]);

  return (
    <DialogRoot>
      <DialogTrigger {...rest} />
      <SettingsDialog board={split.board} />
    </DialogRoot>
  );
};

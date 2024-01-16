import { type Component } from "solid-js";

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

import { UpdateForm } from "../UpdateForm";

type SettingsDialogProps = {
  boardId: string;
  isOpen: boolean;
  onIsOpenChange: (isOpen: boolean) => void;
};

export const SettingsDialog: Component<SettingsDialogProps> = (props) => {
  const { t } = useI18n();

  return (
    <DialogRoot onOpenChange={props.onIsOpenChange} open={props.isOpen}>
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
    </DialogRoot>
  );
};

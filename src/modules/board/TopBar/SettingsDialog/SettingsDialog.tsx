import { HiSolidCog, HiSolidXMark } from "solid-icons/hi";
import { type Component } from "solid-js";
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
import { DeleteBoard } from "../DeleteDialog";
import { UpdateForm } from "../UpdateForm";

type SettingsDialogProps = {
  boardId: string;
};

export const SettingsDialog: Component<SettingsDialogProps> = (props) => {
  const { t } = useI18n();

  return (
    <DialogRoot>
      <DialogTrigger aria-label={t("board.settings.label")} size="sm">
        <HiSolidCog />
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("board.settings.title")}</DialogTitle>
              <DialogCloseButton>
                <HiSolidXMark />
              </DialogCloseButton>
            </DialogHeader>
            <UpdateForm boardId={props.boardId} />
            <DeleteBoard boardId={props.boardId} />
          </DialogContent>
        </DialogPositioner>
      </DialogPortal>
    </DialogRoot>
  );
};

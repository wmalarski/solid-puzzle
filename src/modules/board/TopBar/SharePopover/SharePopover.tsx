import { type Component, Suspense, createMemo } from "solid-js";

import type { BoardModel } from "~/types/models";

import { Button } from "~/components/Button";
import { ShareIcon } from "~/components/Icons/ShareIcon";
import { XIcon } from "~/components/Icons/XIcon";
import {
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverPortal,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "~/components/Popover";
import {
  TextFieldInput,
  TextFieldLabel,
  TextFieldLabelText,
  TextFieldRoot,
} from "~/components/TextField";
import { useI18n } from "~/contexts/I18nContext";
import { paths } from "~/utils/paths";
import { buildSearchParams } from "~/utils/searchParams";

type ShareFormProps = {
  board: BoardModel;
};

const ShareForm: Component<ShareFormProps> = (props) => {
  const { t } = useI18n();

  const value = createMemo(() => {
    const search = buildSearchParams({});
    return `${window.location.origin}${paths.invite(props.board.id)}?${search}`;
  });

  const onCopyToClipboard = () => {
    navigator.clipboard.writeText(value() || "");
  };

  return (
    <form class="flex flex-col gap-4" method="post">
      <input name="boardId" type="hidden" value={props.board.id} />
      <TextFieldRoot>
        <TextFieldLabel for="token">
          <TextFieldLabelText>{t("board.share.link")}</TextFieldLabelText>
        </TextFieldLabel>
        <TextFieldInput
          id="token"
          placeholder={t("board.share.loading")}
          readOnly
          value={value()}
          variant="bordered"
        />
      </TextFieldRoot>
      <Button onClick={onCopyToClipboard} type="button">
        {t("board.share.copy")}
      </Button>
      <Button type="submit">{t("board.share.regenerate")}</Button>
    </form>
  );
};

type SharePopoverProps = {
  board: BoardModel;
};

export const SharePopover: Component<SharePopoverProps> = (props) => {
  const { t } = useI18n();

  return (
    <PopoverRoot>
      <PopoverTrigger aria-label={t("board.share.title")} size="sm">
        <ShareIcon />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>
            <PopoverTitle>{t("board.share.title")}</PopoverTitle>
            <PopoverCloseButton>
              <XIcon />
            </PopoverCloseButton>
          </PopoverHeader>
          <Suspense>
            <ShareForm board={props.board} />
          </Suspense>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  );
};

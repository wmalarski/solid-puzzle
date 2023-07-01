import { useI18n } from "@solid-primitives/i18n";
import { createQuery } from "@tanstack/solid-query";
import { HiOutlineLink, HiSolidXMark } from "solid-icons/hi";
import { Show, Suspense, createMemo, type Component } from "solid-js";
import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
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
import type { BoardModel } from "~/db/types";
import {
  generateBoardInviteQueryKey,
  generateBoardInviteServerQuery,
} from "~/server/share/actions";
import { paths } from "~/utils/paths";
import { buildSearchParams } from "~/utils/searchParams";

type ShareFormProps = {
  board: BoardModel;
};

const ShareForm: Component<ShareFormProps> = (props) => {
  const [t] = useI18n();

  const inviteQuery = createQuery(() => ({
    queryFn: (context) => generateBoardInviteServerQuery(context.queryKey),
    queryKey: generateBoardInviteQueryKey({ boardId: props.board.id }),
    suspense: false,
  }));

  const value = createMemo(() => {
    if (inviteQuery.status !== "success") {
      return;
    }

    return `${window.location.origin}${paths.invite(
      props.board.id
    )}?${buildSearchParams({ token: inviteQuery.data.token })}`;
  });

  const onCopyToClipboard = () => {
    navigator.clipboard.writeText(value() || "");
  };

  return (
    <form class="flex flex-col gap-4">
      <input type="hidden" name="boardId" value={props.board.id} />
      <Show when={inviteQuery.error}>
        {(error) => (
          <Alert variant="error">
            <AlertIcon variant="error" />
            {error().message}
          </Alert>
        )}
      </Show>
      <TextFieldRoot>
        <TextFieldLabel for="token">
          <TextFieldLabelText>{t("board.share.link")}</TextFieldLabelText>
        </TextFieldLabel>
        <TextFieldInput
          id="token"
          placeholder={t("board.share.loading")}
          readOnly
          variant="bordered"
          value={value()}
        />
      </TextFieldRoot>
      <Button
        disabled={inviteQuery.isPending}
        isLoading={inviteQuery.isPending}
        onClick={onCopyToClipboard}
        type="button"
      >
        {t("board.share.copy")}
      </Button>
      <Button
        disabled={inviteQuery.isPending}
        isLoading={inviteQuery.isPending}
        type="submit"
      >
        {t("board.share.regenerate")}
      </Button>
    </form>
  );
};

type SharePopoverProps = {
  board: BoardModel;
};

export const SharePopover: Component<SharePopoverProps> = (props) => {
  const [t] = useI18n();

  return (
    <PopoverRoot>
      <PopoverTrigger size="sm" aria-label={t("board.share.title")}>
        <HiOutlineLink />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>
            <PopoverTitle>{t("board.share.title")}</PopoverTitle>
            <PopoverCloseButton>
              <HiSolidXMark />
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

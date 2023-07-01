import { useI18n } from "@solid-primitives/i18n";
import { createQuery } from "@tanstack/solid-query";
import { HiOutlineLink, HiSolidXMark } from "solid-icons/hi";
import { Show, createEffect, createMemo, type Component } from "solid-js";
import { useLocation } from "solid-start";
import server$ from "solid-start/server";
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
import { generateBoardInviteQueryKey } from "~/server/share/actions";
import { paths } from "~/utils/paths";
import { buildSearchParams } from "~/utils/searchParams";

type ShareFormProps = {
  board: BoardModel;
};

export const generate = server$(async ([, args]: any[]) => {
  console.log("AAA", args);
  return await Promise.resolve({ token: "BBB" });
});

const ShareForm: Component<ShareFormProps> = (props) => {
  const [t] = useI18n();

  const inviteQuery = createQuery(() => ({
    queryFn: (context) => generate(context.queryKey),
    queryKey: generateBoardInviteQueryKey({ boardId: props.board.id }),
  }));

  const location = useLocation();

  const value = createMemo(() => {
    if (inviteQuery.status !== "success") {
      return;
    }

    return `${window.location.origin}${paths.invite(
      props.board.id
    )}?${buildSearchParams({ token: inviteQuery.data.token })}`;
  });

  createEffect(() => {
    console.log({
      data: inviteQuery.data,
      error: inviteQuery.error,
      l: window.location,
      link: value(),
      location,
      status: inviteQuery.status,
    });
  });

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
          <ShareForm board={props.board} />
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  );
};

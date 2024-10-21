import type { ComponentProps } from "solid-js";

import { createMemo } from "solid-js";

import type { BoardAccess } from "~/server/access/rpc";
import type { BoardModel } from "~/types/models";

import { EyeIcon } from "~/components/Icons/EyeIcon";
import { EyeOffIcon } from "~/components/Icons/EyeOffIcon";
import { ShareIcon } from "~/components/Icons/ShareIcon";
import { showToast } from "~/components/Toast";
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipRoot,
  TooltipTrigger
} from "~/components/Tooltip";
import { useI18n } from "~/contexts/I18nContext";
import { ThemeToggle } from "~/modules/common/ThemeToggle";

import { usePuzzleStore } from "../DataProviders/PuzzleProvider";
import { usePreviewContext } from "../PreviewContext";
import { AvatarsDialog } from "./AvatarsDialog";

function ShareButton() {
  const { t } = useI18n();

  const onShare = async () => {
    const url = location.href;

    if (typeof navigator.share !== "undefined") {
      await navigator.share({ url });
      return;
    }

    navigator.clipboard.writeText(url);

    showToast({
      description: t("board.share.title"),
      title: t("board.share.copy"),
      variant: "success"
    });
  };

  return (
    <TooltipRoot>
      <TooltipTrigger
        aria-label={t("board.share.title")}
        onClick={onShare}
        shape="circle"
        size="sm"
        type="button"
        variant="ghost"
      >
        <ShareIcon class="size-5" />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>
          <TooltipArrow />
          {t("board.share.title")}
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  );
}

function PreviewVisibilityToggle() {
  const { t } = useI18n();

  const preview = usePreviewContext();

  const onMouseDown = () => {
    preview().setIsPreviewVisible(true);
  };

  const onMouseUp = () => {
    preview().setIsPreviewVisible(false);
  };

  const label = createMemo(() => {
    return t(
      preview().isPreviewVisible()
        ? "board.previewVisibility.hide"
        : "board.previewVisibility.show"
    );
  });

  const enterKey = "Enter";

  const onKeyDown: ComponentProps<"button">["onKeyDown"] = (event) => {
    if (event.key === enterKey) {
      preview().setIsPreviewVisible(true);
    }
  };

  const onKeyUp: ComponentProps<"button">["onKeyUp"] = (event) => {
    if (event.key === enterKey) {
      preview().setIsPreviewVisible(false);
    }
  };

  return (
    <TooltipRoot>
      <TooltipTrigger
        aria-label={label()}
        color={preview().isPreviewVisible() ? "accent" : "secondary"}
        onFocusOut={onMouseUp}
        onKeyPress={onKeyDown}
        onKeyUp={onKeyUp}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseUp}
        onMouseUp={onMouseUp}
        onTouchCancel={onMouseUp}
        onTouchEnd={onMouseUp}
        onTouchStart={onMouseDown}
        shape="circle"
        size="sm"
        type="button"
      >
        {preview().isPreviewVisible() ? (
          <EyeOffIcon class="size-5" />
        ) : (
          <EyeIcon class="size-5" />
        )}
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>
          <TooltipArrow />
          {label()}
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  );
}

type TopBarProps = {
  board: BoardModel;
  boardAccess: BoardAccess;
};

export function TopBar(props: TopBarProps) {
  const store = usePuzzleStore();

  const finishedPercent = () => {
    const all = props.board.columns * props.board.rows;
    const finished = all - store().unfinishedCount();
    return `${Math.round((finished / all) * 10000) / 100}%`;
  };

  return (
    <div class="absolute inset-x-auto right-4 top-4 flex w-min items-center gap-2 rounded-3xl bg-base-300 p-1 shadow-lg">
      <div class="flex flex-col gap-2 p-1 pl-4">
        <div class="flex items-center gap-4">
          <PreviewVisibilityToggle />
          <h1 class="grow font-bold">{props.board.name}</h1>
          <span class="text-nowrap text-sm opacity-80">{`${props.board.columns}x${props.board.rows}`}</span>
          <span class="text-nowrap text-sm opacity-80">
            {finishedPercent()}
          </span>
          <ThemeToggle />
          <ShareButton />
        </div>
        <h2 class="text-sm">{props.board.media}</h2>
      </div>
      <AvatarsDialog />
    </div>
  );
}

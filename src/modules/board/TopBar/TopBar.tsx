import { type Component } from "solid-js";

import type { BoardAccess, BoardModel } from "~/types/models";

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

import { AvatarsDialog } from "./AvatarsDialog";

export const ShareButton: Component = () => {
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
};

type TopBarProps = {
  board: BoardModel;
  boardAccess: BoardAccess;
};

export const TopBar: Component<TopBarProps> = (props) => {
  return (
    <div class="absolute inset-x-auto right-4 top-4 flex w-min items-center gap-4 rounded-3xl bg-base-300 p-1 shadow-lg">
      <div class="flex flex-col gap-2 p-1 pl-4">
        <div class="flex items-center gap-2">
          <h1 class="grow font-bold">{props.board.name}</h1>
          <ShareButton />
        </div>
        <h2 class="text-sm">{props.board.media}</h2>
      </div>
      <AvatarsDialog />
    </div>
  );
};

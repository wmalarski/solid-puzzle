import type { ParentProps } from "solid-js";

import { revalidate, useNavigate } from "@solidjs/router";
import {
  REALTIME_LISTEN_TYPES,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT
} from "@supabase/supabase-js";
import {
  createContext,
  createEffect,
  createMemo,
  onCleanup,
  useContext
} from "solid-js";

import { showToast } from "~/components/Toast";
import { useI18n } from "~/contexts/I18nContext";
import {
  SELECT_BOARD_LOADER_CACHE_KEY,
  SELECT_BOARDS_LOADER_CACHE_KEY
} from "~/server/board/const";
import { paths } from "~/utils/paths";
import { getClientSupabase } from "~/utils/supabase";

import { useBroadcastChannel } from "./BroadcastProvider";

const BOARD_UPDATE_CHANNEL_NAME = "rooms:update_board";
const REVALIDATE_EVENT_NAME = "rooms:revalidate";

const createBoardRevalidate = () => {
  const { t } = useI18n();

  const broadcastChannel = useBroadcastChannel();

  const setRemoteRevalidate = async () => {
    showToast({
      description: t("board.toasts.updatedDescription"),
      title: t("board.toasts.updated"),
      variant: "info"
    });
    await revalidate(SELECT_BOARD_LOADER_CACHE_KEY);
  };

  const sendRevalidate = () => {
    broadcastChannel().send({
      event: REVALIDATE_EVENT_NAME,
      type: REALTIME_LISTEN_TYPES.BROADCAST
    });
  };

  broadcastChannel().on(
    REALTIME_LISTEN_TYPES.BROADCAST,
    { event: REVALIDATE_EVENT_NAME },
    () => setRemoteRevalidate()
  );

  return { sendRevalidate };
};

type BoardRevalidateContextState = () => ReturnType<
  typeof createBoardRevalidate
>;

const BoardRevalidateContext = createContext<BoardRevalidateContextState>(
  () => {
    throw new Error("BoardRevalidateContext not defined");
  }
);

type BoardRevalidateProviderProps = ParentProps<{
  boardId: string;
}>;

export function BoardRevalidateProvider(props: BoardRevalidateProviderProps) {
  const { t } = useI18n();

  const navigate = useNavigate();

  const boardRevalidate = createMemo(() => createBoardRevalidate());

  createEffect(() => {
    const supabase = getClientSupabase();

    const channel = supabase
      .channel(BOARD_UPDATE_CHANNEL_NAME)
      .on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
        {
          event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE,
          filter: `id=eq.${props.boardId}`,
          schema: "public",
          table: "rooms"
        },
        async () => {
          showToast({
            description: t("board.toasts.deletedDescription"),
            title: t("board.toasts.deleted"),
            variant: "error"
          });
          await revalidate(SELECT_BOARDS_LOADER_CACHE_KEY);
          navigate(paths.home);
        }
      )
      .subscribe();

    onCleanup(() => {
      supabase.removeChannel(channel);
    });
  });

  return (
    <BoardRevalidateContext.Provider value={boardRevalidate}>
      {props.children}
    </BoardRevalidateContext.Provider>
  );
}

export const useBoardRevalidate = () => {
  return useContext(BoardRevalidateContext);
};

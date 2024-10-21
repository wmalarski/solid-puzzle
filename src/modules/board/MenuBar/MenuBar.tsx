import {
  revalidate,
  useAction,
  useNavigate,
  useSubmission
} from "@solidjs/router";
import { createSignal, Show } from "solid-js";

import type { BoardModel } from "~/types/models";

import { LinkButton } from "~/components/Button";
import {
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuItemLabel,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "~/components/DropdownMenu";
import { ExitIcon } from "~/components/Icons/ExitIcon";
import { HomeIcon } from "~/components/Icons/HomeIcon";
import { ListIcon } from "~/components/Icons/ListIcon";
import { MenuIcon } from "~/components/Icons/MenuIcon";
import { SettingsIcon } from "~/components/Icons/SettingsIcon";
import { TrashIcon } from "~/components/Icons/TrashIcon";
import { useI18n } from "~/contexts/I18nContext";
import { useUserContext } from "~/contexts/UserContext";
import { DeleteBoardControlledDialog } from "~/modules/boards/DeleteDialog";
import { SettingsControlledDialog } from "~/modules/boards/SettingsDialog";
import { signOutAction } from "~/server/auth/client";
import { SELECT_BOARD_LOADER_CACHE_KEY } from "~/server/board/const";
import { paths } from "~/utils/paths";

import { useBoardRevalidate } from "../DataProviders/BoardRevalidate";
import { usePlayerSelection } from "../DataProviders/SelectionProvider";

function SignOutMenuItem() {
  const { t } = useI18n();

  const action = useAction(signOutAction);

  const submission = useSubmission(signOutAction);

  const onSelect = () => {
    action();
  };

  return (
    <DropdownMenuItem disabled={submission.pending} onSelect={onSelect}>
      <DropdownMenuItemLabel>
        <ExitIcon class="size-4" />
        {t("auth.signOut")}
      </DropdownMenuItemLabel>
    </DropdownMenuItem>
  );
}

type MenuProps = {
  board: BoardModel;
};

function Menu(props: MenuProps) {
  const { t } = useI18n();

  const user = useUserContext();
  const selection = usePlayerSelection();
  const boardRevalidate = useBoardRevalidate();

  const navigate = useNavigate();

  const [isDeleteOpen, setIsDeleteOpen] = createSignal(false);
  const [areSettingsOpen, setAreSettingsOpen] = createSignal(false);

  const onHomePageClick = () => {
    navigate(paths.home);
  };

  const onBoardsPageClick = () => {
    navigate(paths.boards());
  };

  const onSettingsClick = () => {
    setAreSettingsOpen(true);
  };

  const onDeleteClick = () => {
    setIsDeleteOpen(true);
  };

  const onUpdateSuccess = async () => {
    selection().clear();
    boardRevalidate().sendRevalidate();
    await revalidate(SELECT_BOARD_LOADER_CACHE_KEY);
  };

  return (
    <>
      <Show when={props.board.owner_id === user()?.id}>
        <DeleteBoardControlledDialog
          boardId={props.board.id}
          isOpen={isDeleteOpen()}
          onIsOpenChange={setIsDeleteOpen}
        />
        <SettingsControlledDialog
          board={props.board}
          isOpen={areSettingsOpen()}
          onIsOpenChange={setAreSettingsOpen}
          onSuccess={onUpdateSuccess}
        />
      </Show>
      <DropdownMenuRoot>
        <DropdownMenuTrigger
          aria-label={t("board.menu")}
          shape="circle"
          size="sm"
          variant="ghost"
        >
          <DropdownMenuIcon>
            <MenuIcon />
          </DropdownMenuIcon>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent>
            <DropdownMenuArrow />
            <DropdownMenuItem onSelect={onHomePageClick}>
              <DropdownMenuItemLabel>
                <HomeIcon class="size-4" />
                {t("board.newBoard")}
              </DropdownMenuItemLabel>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onBoardsPageClick}>
              <DropdownMenuItemLabel>
                <ListIcon class="size-4" />
                {t("board.boards")}
              </DropdownMenuItemLabel>
            </DropdownMenuItem>
            <Show when={props.board.owner_id === user()?.id}>
              <DropdownMenuItem onSelect={onSettingsClick}>
                <DropdownMenuItemLabel>
                  <SettingsIcon class="size-4" />
                  {t("settings.label")}
                </DropdownMenuItemLabel>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onDeleteClick}>
                <DropdownMenuItemLabel>
                  <TrashIcon class="size-4" />
                  {t("settings.delete.button")}
                </DropdownMenuItemLabel>
              </DropdownMenuItem>
            </Show>
            <DropdownMenuSeparator />
            <SignOutMenuItem />
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </>
  );
}

type MenuBarProps = {
  board: BoardModel;
};

export function MenuBar(props: MenuBarProps) {
  const { t } = useI18n();

  const user = useUserContext();

  return (
    <div class="absolute left-4 top-4 rounded-3xl bg-base-300 p-1 shadow-lg">
      <Show
        fallback={
          <LinkButton
            aria-label={t("board.home")}
            href={paths.home}
            shape="circle"
            size="sm"
            variant="ghost"
          >
            <HomeIcon class="size-5" />
          </LinkButton>
        }
        when={user()}
      >
        <Menu board={props.board} />
      </Show>
    </div>
  );
}

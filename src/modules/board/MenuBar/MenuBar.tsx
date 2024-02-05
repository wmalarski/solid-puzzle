import { useAction, useNavigate, useSubmission } from "@solidjs/router";
import { type Component, Show, createSignal } from "solid-js";

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
import { MenuIcon } from "~/components/Icons/MenuIcon";
import { SettingsIcon } from "~/components/Icons/SettingsIcon";
import { TrashIcon } from "~/components/Icons/TrashIcon";
import { useI18n } from "~/contexts/I18nContext";
import { useSessionContext } from "~/contexts/SessionContext";
import { DeleteBoardControlledDialog } from "~/modules/boards/DeleteDialog";
import { SettingsControlledDialog } from "~/modules/boards/SettingsDialog";
import { signOutAction } from "~/server/auth/client";
import { paths } from "~/utils/paths";

const SignOutMenuItem: Component = () => {
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
};

type MenuProps = {
  board: BoardModel;
};

const Menu: Component<MenuProps> = (props) => {
  const { t } = useI18n();

  const session = useSessionContext();

  const navigate = useNavigate();

  const [isDeleteOpen, setIsDeleteOpen] = createSignal(false);
  const [areSettingsOpen, setAreSettingsOpen] = createSignal(false);

  const onHomePageClick = () => {
    navigate(paths.home);
  };

  const onSettingsClick = () => {
    setAreSettingsOpen(true);
  };

  const onDeleteClick = () => {
    setIsDeleteOpen(true);
  };

  const onDeleteSuccess = () => {
    navigate(paths.boards);
  };

  return (
    <>
      <DeleteBoardControlledDialog
        boardId={props.board.id}
        isOpen={isDeleteOpen()}
        onIsOpenChange={setIsDeleteOpen}
        onSuccess={onDeleteSuccess}
      />
      <Show when={props.board.owner_id === session()?.user.id}>
        <SettingsControlledDialog
          board={props.board}
          isOpen={areSettingsOpen()}
          onIsOpenChange={setAreSettingsOpen}
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
                {t("board.home")}
              </DropdownMenuItemLabel>
            </DropdownMenuItem>
            <Show when={props.board.owner_id === session()?.user.id}>
              <DropdownMenuItem onSelect={onSettingsClick}>
                <DropdownMenuItemLabel>
                  <SettingsIcon class="size-4" />
                  {t("board.newGame")}
                </DropdownMenuItemLabel>
              </DropdownMenuItem>
            </Show>
            <DropdownMenuItem onSelect={onDeleteClick}>
              <DropdownMenuItemLabel>
                <TrashIcon class="size-4" />
                {t("board.settings.delete.button")}
              </DropdownMenuItemLabel>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <SignOutMenuItem />
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </>
  );
};

type MenuBarProps = {
  board: BoardModel;
};

export const MenuBar: Component<MenuBarProps> = (props) => {
  const { t } = useI18n();

  const session = useSessionContext();

  return (
    <div class="absolute left-4 top-4 rounded-3xl bg-base-300 p-1 shadow">
      <Show
        fallback={
          <LinkButton
            aria-label={t("board.home")}
            href={paths.home}
            shape="square"
            size="sm"
            variant="ghost"
          >
            <HomeIcon class="size-5" />
          </LinkButton>
        }
        when={session()}
      >
        <Menu board={props.board} />
      </Show>
    </div>
  );
};

import { useAction, useNavigate, useSubmission } from "@solidjs/router";
import { type Component, Show, createSignal } from "solid-js";

import { LinkButton } from "~/components/Button";
import {
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuItemLabel,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger
} from "~/components/DropdownMenu";
import { HomeIcon } from "~/components/Icons/HomeIcon";
import { MenuIcon } from "~/components/Icons/MenuIcon";
import { TrashIcon } from "~/components/Icons/TrashIcon";
import { useI18n } from "~/contexts/I18nContext";
import { useSessionContext } from "~/contexts/SessionContext";
import { signOutAction } from "~/server/auth/client";
import { paths } from "~/utils/paths";

import { DeleteBoardDialog } from "./DeleteDialog";

const SignOutMenuItem: Component = () => {
  const { t } = useI18n();

  const action = useAction(signOutAction);

  const submission = useSubmission(signOutAction);

  const onSelect = () => {
    action();
  };

  return (
    <DropdownMenuItem disabled={submission.pending} onSelect={onSelect}>
      <DropdownMenuItemLabel>{t("auth.signOut")}</DropdownMenuItemLabel>
    </DropdownMenuItem>
  );
};

type MenuProps = {
  boardId: string;
};

const Menu: Component<MenuProps> = (props) => {
  const { t } = useI18n();

  const navigate = useNavigate();

  const [isDeleteOpen, setIsDeleteOpen] = createSignal(false);

  const onHomePageClick = () => {
    navigate(paths.home);
  };

  const onSettingsClick = () => {
    //
  };

  const onDeleteClick = () => {
    setIsDeleteOpen(true);
  };

  return (
    <>
      <DeleteBoardDialog
        boardId={props.boardId}
        isOpen={isDeleteOpen()}
        onIsOpenChange={setIsDeleteOpen}
      />
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
              <DropdownMenuItemLabel>{t("board.home")}</DropdownMenuItemLabel>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DropdownMenuItemLabel>
                {t("board.newGame")}
              </DropdownMenuItemLabel>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onSettingsClick}>
              <DropdownMenuItemLabel>
                {t("board.settings.label")}
              </DropdownMenuItemLabel>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onDeleteClick}>
              <DropdownMenuItemLabel>
                <TrashIcon class="size-4" />
                {t("board.settings.delete.button")}
              </DropdownMenuItemLabel>
            </DropdownMenuItem>
            <SignOutMenuItem />
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </>
  );
};

type MenuBarProps = {
  boardId: string;
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
        <Menu boardId={props.boardId} />
      </Show>
    </div>
  );
};

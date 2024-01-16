import type { Component } from "solid-js";

import { useAction, useNavigate, useSubmission } from "@solidjs/router";

import {
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuIcon,
  DropdownMenuItem,
  DropdownMenuItemLabel,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "~/components/DropdownMenu";
import { MenuIcon } from "~/components/Icons/MenuIcon";
import { useI18n } from "~/contexts/I18nContext";
import { signOutAction } from "~/services/auth";
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
      <DropdownMenuItemLabel>{t("auth.signOut")}</DropdownMenuItemLabel>
    </DropdownMenuItem>
  );
};

const Menu: Component = () => {
  const { t } = useI18n();

  const navigate = useNavigate();

  const onHomePageClick = () => {
    navigate(paths.home);
  };

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger
        aria-label={t("board.menu")}
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
            <DropdownMenuItemLabel>{t("board.newGame")}</DropdownMenuItemLabel>
          </DropdownMenuItem>
          <SignOutMenuItem />
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  );
};

export const MenuBar: Component = () => {
  return (
    <div class="absolute left-4 top-4 rounded-3xl bg-base-300 p-1 shadow">
      <Menu />
    </div>
  );
};

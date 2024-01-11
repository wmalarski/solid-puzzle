import type { Component } from "solid-js";

import { revalidate, useNavigate } from "@solidjs/router";
import { createMutation } from "@tanstack/solid-query";

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
import { SESSION_CACHE_NAME } from "~/server/auth/client";
import { signOutServerAction } from "~/server/auth/rpc";
import { paths } from "~/utils/paths";

const SignOutMenuItem: Component = () => {
  const { t } = useI18n();

  const navigate = useNavigate();

  const mutation = createMutation(() => ({
    mutationFn: signOutServerAction,
    async onSuccess() {
      await revalidate(SESSION_CACHE_NAME);
      navigate(paths.home);
    },
  }));

  const onSelect = () => {
    mutation.mutate();
  };

  return (
    <DropdownMenuItem disabled={mutation.isPending} onSelect={onSelect}>
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

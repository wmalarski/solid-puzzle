import { useI18n } from "@solid-primitives/i18n";
import { HiOutlineBars3 } from "solid-icons/hi";
import type { Component } from "solid-js";
import { useNavigate } from "solid-start";
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
import { createSignOutServerAction } from "~/server/auth";
import { paths } from "~/utils/paths";

const SignOutMenuItem: Component = () => {
  const [t] = useI18n();

  const [signOut, action] = createSignOutServerAction();

  const onSelect = async () => {
    await action(new FormData());
  };

  return (
    <DropdownMenuItem disabled={signOut.pending} onSelect={onSelect}>
      <DropdownMenuItemLabel>{t("auth.signOut")}</DropdownMenuItemLabel>
    </DropdownMenuItem>
  );
};

const Menu: Component = () => {
  const [t] = useI18n();

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
          <HiOutlineBars3 />
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
    <div class="absolute left-4 top-4 rounded-3xl bg-neutral-100 p-1 shadow">
      <Menu />
    </div>
  );
};

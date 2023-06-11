import { useI18n } from "@solid-primitives/i18n";
import { FiMenu } from "solid-icons/fi";
import type { Component } from "solid-js";
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

const Menu: Component = () => {
  const [t] = useI18n();

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger
        aria-label={t("board.menu")}
        size="sm"
        variant="ghost"
      >
        <DropdownMenuIcon>
          <FiMenu />
        </DropdownMenuIcon>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuArrow />
          <DropdownMenuItem class="flex h-12 flex-col items-start justify-center">
            <DropdownMenuItemLabel>{t("board.newGame")}</DropdownMenuItemLabel>
          </DropdownMenuItem>
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

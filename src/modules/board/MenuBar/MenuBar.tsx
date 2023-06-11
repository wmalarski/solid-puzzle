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
import { Navbar } from "~/components/Navbar";

const Menu: Component = () => {
  const [t] = useI18n();

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger
        aria-label={t("board.menu")}
        shape="square"
        size="sm"
        variant="ghost"
      >
        <DropdownMenuIcon rotation={90}>
          <FiMenu />
        </DropdownMenuIcon>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent class="max-h-96 overflow-y-scroll">
          <DropdownMenuItem class="flex h-12 flex-col items-start justify-center">
            <DropdownMenuItemLabel>{t("board.newGame")}</DropdownMenuItemLabel>
          </DropdownMenuItem>
          <DropdownMenuArrow />
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  );
};

export const TopNavbar: Component = () => {
  return (
    <Navbar class="absolute left-4 top-4 bg-neutral-200 p-4">
      <Menu />
    </Navbar>
  );
};

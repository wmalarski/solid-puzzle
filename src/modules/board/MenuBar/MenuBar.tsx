import { useI18n } from "@solid-primitives/i18n";
import { IoAddSharp } from "solid-icons/io";
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
        aria-label={t("dashboard.create")}
        shape="square"
        size="sm"
        variant="ghost"
      >
        <DropdownMenuIcon rotation={90}>
          <IoAddSharp />
        </DropdownMenuIcon>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent class="max-h-96 overflow-y-scroll">
          <DropdownMenuItem class="flex h-12 flex-col items-start justify-center">
            <DropdownMenuItemLabel>Item</DropdownMenuItemLabel>
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

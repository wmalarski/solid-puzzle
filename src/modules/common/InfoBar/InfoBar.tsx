import { useI18n } from "@solid-primitives/i18n";
import { FiInfo } from "solid-icons/fi";
import { IoCloseSharp } from "solid-icons/io";
import type { Component } from "solid-js";
import { Navbar, NavbarStart } from "~/components/Navbar";
import {
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverPortal,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "~/components/Popover";

const InfoPopover: Component = () => {
  const [t] = useI18n();

  return (
    <PopoverRoot>
      <PopoverTrigger size="sm">
        <FiInfo />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>
            <PopoverTitle>{t("info.title")}</PopoverTitle>
            <PopoverCloseButton>
              <IoCloseSharp />
            </PopoverCloseButton>
          </PopoverHeader>
          <PopoverDescription>{t("info.madeBy")}</PopoverDescription>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  );
};

export const InfoBar: Component = () => {
  return (
    <Navbar class="absolute bottom-4 right-4 bg-neutral-200 p-4">
      <NavbarStart>
        <InfoPopover />
      </NavbarStart>
    </Navbar>
  );
};

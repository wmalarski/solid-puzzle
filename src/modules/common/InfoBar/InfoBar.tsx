import { useI18n } from "@solid-primitives/i18n";
import { FiInfo } from "solid-icons/fi";
import { IoCloseSharp } from "solid-icons/io";
import type { Component } from "solid-js";
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
      <PopoverTrigger variant="ghost" size="sm">
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
    <div class="absolute bottom-4 right-4 rounded-3xl bg-neutral-100 p-1 shadow">
      <InfoPopover />
    </div>
  );
};

import { Info, X } from "lucide-solid";
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
import { useI18n } from "~/contexts/I18nContext";

const InfoPopover: Component = () => {
  const { t } = useI18n();

  return (
    <PopoverRoot>
      <PopoverTrigger variant="ghost" size="sm">
        <Info />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>
            <PopoverTitle>{t("info.title")}</PopoverTitle>
            <PopoverCloseButton>
              <X />
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

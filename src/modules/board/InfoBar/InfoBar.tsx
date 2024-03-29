import { InfoIcon } from "~/components/Icons/InfoIcon";
import { XIcon } from "~/components/Icons/XIcon";
import { Link } from "~/components/Link";
import {
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverPortal,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger
} from "~/components/Popover";
import { useI18n } from "~/contexts/I18nContext";
import { paths } from "~/utils/paths";

function InfoPopover() {
  const { t } = useI18n();

  return (
    <PopoverRoot>
      <PopoverTrigger shape="circle" size="sm" variant="ghost">
        <InfoIcon />
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>
            <PopoverTitle>{t("info.title")}</PopoverTitle>
            <PopoverCloseButton>
              <XIcon />
            </PopoverCloseButton>
          </PopoverHeader>
          <PopoverDescription>
            <Link href={paths.repository}>{t("info.madeBy")}</Link>
          </PopoverDescription>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  );
}

export function InfoBar() {
  return (
    <div class="absolute bottom-4 right-4 rounded-3xl bg-base-300 p-1 shadow-lg">
      <InfoPopover />
    </div>
  );
}

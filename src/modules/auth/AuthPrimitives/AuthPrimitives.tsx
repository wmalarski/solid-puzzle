import { useI18n } from "@solid-primitives/i18n";
import { HiOutlinePuzzlePiece } from "solid-icons/hi";
import type { Component } from "solid-js";
import { Link } from "~/components/Link";
import { paths } from "~/utils/paths";

export const AuthFooter: Component = () => {
  const [t] = useI18n();

  return (
    <div class="p-4">
      <a class="link text-xs" href={paths.repository}>
        {t("footer.madeBy")}
      </a>
    </div>
  );
};

export const AuthTitle: Component = () => {
  const [t] = useI18n();

  return (
    <h1 class="max-6-xs my-16 flex items-center text-center text-4xl uppercase sm:text-6xl">
      <HiOutlinePuzzlePiece />
      <Link hover href={paths.home}>
        {t("home.title")}
      </Link>
    </h1>
  );
};

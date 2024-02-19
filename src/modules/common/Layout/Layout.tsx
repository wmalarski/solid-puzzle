import type { Component, JSX } from "solid-js";

import { PuzzleIcon } from "~/components/Icons/PuzzleIcon";
import { Link } from "~/components/Link";
import { useI18n } from "~/contexts/I18nContext";
import { paths } from "~/utils/paths";

export const PageTitle: Component = () => {
  const { t } = useI18n();

  return (
    <h1 class="max-6-xs my-16 flex items-center text-center text-4xl uppercase sm:text-6xl">
      <PuzzleIcon class="size-12" />
      <Link hover href={paths.home}>
        {t("home.title")}
      </Link>
    </h1>
  );
};

export const PageFooter: Component = () => {
  const { t } = useI18n();

  return (
    <footer class="p-4">
      <Link href={paths.repository} size="xs">
        {t("footer.madeBy")}
      </Link>
    </footer>
  );
};

type FormLayoutProps = {
  children: JSX.Element;
};

export const FormLayout: Component<FormLayoutProps> = (props) => {
  return (
    <main class="mx-auto flex flex-col items-center p-4">{props.children}</main>
  );
};

type PageLayoutProps = {
  children: JSX.Element;
};

export const PageLayout: Component<PageLayoutProps> = (props) => {
  return (
    <main class="mx-auto flex flex-col items-center">{props.children}</main>
  );
};

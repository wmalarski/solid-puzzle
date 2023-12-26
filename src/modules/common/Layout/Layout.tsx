import { Puzzle } from "lucide-solid";
import type { Component, JSX } from "solid-js";
import { Link } from "~/components/Link";
import { useI18n } from "~/contexts/I18nContext";
import { paths } from "~/utils/paths";

export const PageTitle: Component = () => {
  const { t } = useI18n();

  return (
    <h1 class="max-6-xs my-16 flex items-center text-center text-4xl uppercase sm:text-6xl">
      <Puzzle />
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
      <a class="link text-xs" href={paths.repository}>
        {t("footer.madeBy")}
      </a>
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

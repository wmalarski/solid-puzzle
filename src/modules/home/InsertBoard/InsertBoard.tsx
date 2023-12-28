import { type Component } from "solid-js";
import { cardTitleClass } from "~/components/Card";
import { useI18n } from "~/contexts/I18nContext";
import { CreateBoardForm } from "~/modules/createBoard/CreateBoardForm";

export const InsertBoard: Component = () => {
  const { t } = useI18n();

  return (
    <section class="flex max-w-screen-lg flex-col items-center justify-between gap-2 pt-8">
      <header class="flex items-center justify-between gap-2">
        <h2 class={cardTitleClass()}>{t("createBoard.title")}</h2>
      </header>
      <CreateBoardForm />
    </section>
  );
};

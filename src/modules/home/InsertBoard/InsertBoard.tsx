import { type Component } from "solid-js";

import type { BoardConfigFields } from "~/modules/createBoard/ConfigFields";

import { cardTitleClass } from "~/components/Card";
import { useI18n } from "~/contexts/I18nContext";
import { CreateBoardForm } from "~/modules/createBoard/CreateBoardForm";

type InsertBoardProps = {
  initialValues?: BoardConfigFields | null;
};

export const InsertBoard: Component<InsertBoardProps> = (props) => {
  const { t } = useI18n();

  return (
    <section class="flex w-full max-w-screen-lg flex-col items-center justify-between gap-2 px-4 pt-8">
      <header class="flex items-center justify-between gap-2">
        <h2 class={cardTitleClass()}>{t("createBoard.title")}</h2>
      </header>
      <CreateBoardForm initialValues={props.initialValues} />
    </section>
  );
};

import { type Component } from "solid-js";

import { Card, CardBody, cardTitleClass } from "~/components/Card";
import { useI18n } from "~/contexts/I18nContext";

import { CreateBoardForm } from "../CreateBoardForm";

export const CreateBoard: Component = () => {
  const { t } = useI18n();

  return (
    <Card class="mt-4 w-full max-w-xl sm:mt-12" variant="bordered">
      <CardBody>
        <header class="flex items-center justify-between gap-2">
          <h2 class={cardTitleClass()}>{t("createBoard.title")}</h2>
        </header>
        <CreateBoardForm />
      </CardBody>
    </Card>
  );
};

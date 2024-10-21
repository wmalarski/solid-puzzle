import { Component } from "solid-js";

import type { BoardConfigFields } from "~/modules/createBoard/ConfigFields/ConfigFields";

import { Card, CardBody } from "~/components/Card/Card";
import { cardTitleRecipe } from "~/components/Card/Card.recipe";
import { useI18n } from "~/contexts/I18nContext";
import { CreateBoardForm } from "~/modules/createBoard/CreateBoardForm/CreateBoardForm";

type InsertBoardProps = {
  initialValues?: BoardConfigFields | null;
};

export const InsertBoard: Component<InsertBoardProps> = (props) => {
  const { t } = useI18n();

  return (
    <Card bg="base-200" class="w-full max-w-md" variant="bordered">
      <CardBody>
        <header class="flex items-center justify-between gap-2">
          <h2 class={cardTitleRecipe()}>{t("createBoard.title")}</h2>
        </header>
        <CreateBoardForm initialValues={props.initialValues} />
      </CardBody>
    </Card>
  );
};

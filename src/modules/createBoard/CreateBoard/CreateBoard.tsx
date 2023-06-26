import { useI18n } from "@solid-primitives/i18n";
import { type Component } from "solid-js";
import { Card, CardBody, cardTitleClass } from "~/components/Card";
import { CreateBoardForm } from "../CreateBoardForm";

export const CreateBoard: Component = () => {
  const [t] = useI18n();

  return (
    <Card variant="bordered" class="mt-4 w-full max-w-xl sm:mt-12">
      <CardBody>
        <header class="flex items-center justify-between gap-2">
          <h2 class={cardTitleClass()}>{t("createBoard.title")}</h2>
        </header>
        <CreateBoardForm />
      </CardBody>
    </Card>
  );
};

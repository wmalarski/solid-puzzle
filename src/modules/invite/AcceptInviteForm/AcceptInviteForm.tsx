import { useSearchParams } from "@solidjs/router";
import { type Component, type ComponentProps } from "solid-js";

import type { BoardModel } from "~/types/models";

import { Button } from "~/components/Button";
import { Card, CardBody, cardTitleClass } from "~/components/Card";
import {
  TextFieldInput,
  TextFieldLabel,
  TextFieldLabelText,
  TextFieldRoot,
} from "~/components/TextField";
import { useI18n } from "~/contexts/I18nContext";

type AcceptInviteFormProps = {
  board: BoardModel;
};

export const AcceptInviteForm: Component<AcceptInviteFormProps> = (props) => {
  const { t } = useI18n();

  const [searchParams] = useSearchParams();

  const onSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();

    // const data = new FormData(event.currentTarget);

    // mutation.mutate(data);
  };

  return (
    <Card class="w-full max-w-md" variant="bordered">
      <CardBody>
        <header class="flex items-center justify-between gap-2">
          <h2 class={cardTitleClass()}>
            {t("invite.title", { name: props.board.name })}
          </h2>
        </header>
        <form class="flex flex-col gap-4" method="post" onSubmit={onSubmit}>
          <input name="token" type="hidden" value={searchParams.token} />
          <TextFieldRoot>
            <TextFieldLabel for="name">
              <TextFieldLabelText>
                {t("invite.username.label")}
              </TextFieldLabelText>
            </TextFieldLabel>
            <TextFieldInput
              id="name"
              name="name"
              placeholder={t("invite.username.placeholder")}
              variant="bordered"
            />
          </TextFieldRoot>
          <Button type="submit">{t("invite.button")}</Button>
        </form>
      </CardBody>
    </Card>
  );
};

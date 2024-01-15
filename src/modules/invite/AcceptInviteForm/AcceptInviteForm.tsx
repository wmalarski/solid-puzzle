import { useSearchParams } from "@solidjs/router";
import { nanoid } from "nanoid";
import { type Component, type ComponentProps } from "solid-js";

import type { BoardAccess } from "~/services/access";

import { Button } from "~/components/Button";
import { Card, CardBody, cardTitleClass } from "~/components/Card";
import {
  TextFieldInput,
  TextFieldLabel,
  TextFieldLabelText,
  TextFieldRoot,
} from "~/components/TextField";
import { useI18n } from "~/contexts/I18nContext";
import { randomHexColor } from "~/utils/colors";

type AcceptInviteFormProps = {
  boardId: string;
  onSubmit: (access: BoardAccess) => void;
};

const defaultPlayerId = nanoid();
const defaultPlayerColor = randomHexColor();

export const AcceptInviteForm: Component<AcceptInviteFormProps> = (props) => {
  const { t } = useI18n();

  const [searchParams] = useSearchParams();

  const onSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    props.onSubmit({
      boardId: props.boardId,
      playerColor: defaultPlayerColor,
      playerId: defaultPlayerId,
      userName: String(data.get("name")),
    });
  };

  return (
    <Card class="w-full max-w-md" variant="bordered">
      <CardBody>
        <header class="flex items-center justify-between gap-2">
          <h2 class={cardTitleClass()}>{t("invite.title")}</h2>
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

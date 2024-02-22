import { useSubmission } from "@solidjs/router";
import { nanoid } from "nanoid";
import { type Component } from "solid-js";

import type { BoardModel } from "~/types/models";

import { Button } from "~/components/Button";
import { Card, CardBody, cardTitleClass } from "~/components/Card";
import {
  TextFieldInput,
  TextFieldLabel,
  TextFieldLabelText,
  TextFieldRoot
} from "~/components/TextField";
import { useI18n } from "~/contexts/I18nContext";
import { FormLayout, PageFooter, PageTitle } from "~/modules/common/Layout";
import { ThemeToggle } from "~/modules/common/ThemeToggle";
import { setBoardAccessAction } from "~/server/access/client";
import { randomHexColor } from "~/utils/colors";

type AcceptInviteFormProps = {
  board: BoardModel;
};

const defaultPlayerId = nanoid();
const defaultPlayerColor = randomHexColor();

export const AcceptInviteForm: Component<AcceptInviteFormProps> = (props) => {
  const { t } = useI18n();

  const submission = useSubmission(setBoardAccessAction);

  return (
    <FormLayout>
      <PageTitle />
      <Card bg="base-200" class="w-full max-w-md" variant="bordered">
        <CardBody>
          <header class="flex items-center justify-between gap-2">
            <h2 class={cardTitleClass()}>
              {t("invite.title", { name: props.board.name })}
              <ThemeToggle />
            </h2>
          </header>
          <form
            action={setBoardAccessAction}
            class="flex flex-col gap-4"
            method="post"
          >
            <input name="boardId" type="hidden" value={props.board.id} />
            <input
              name="playerColor"
              type="hidden"
              value={defaultPlayerColor}
            />
            <input name="playerId" type="hidden" value={defaultPlayerId} />
            <TextFieldRoot>
              <TextFieldLabel for="userName">
                <TextFieldLabelText>
                  {t("invite.username.label")}
                </TextFieldLabelText>
              </TextFieldLabel>
              <TextFieldInput
                disabled={submission.pending}
                id="userName"
                name="userName"
                placeholder={t("invite.username.placeholder")}
                variant="bordered"
              />
            </TextFieldRoot>
            <TextFieldRoot>
              <TextFieldLabel for="color">
                <TextFieldLabelText>{t("invite.color")}</TextFieldLabelText>
              </TextFieldLabel>
              <TextFieldInput
                disabled={submission.pending}
                id="color"
                name="playerColor"
                placeholder={t("invite.color")}
                type="color"
                value={defaultPlayerColor}
                variant="bordered"
                width="full"
              />
            </TextFieldRoot>
            <Button
              disabled={submission.pending}
              isLoading={submission.pending}
              type="submit"
            >
              {t("invite.button")}
            </Button>
          </form>
        </CardBody>
      </Card>

      <PageFooter />
    </FormLayout>
  );
};

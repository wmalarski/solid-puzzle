import { useSubmission } from "@solidjs/router";
import { type Component } from "solid-js";

import { Button } from "~/components/Button";
import { Card, CardBody, cardTitleClass } from "~/components/Card";
import {
  TextFieldInput,
  TextFieldLabel,
  TextFieldLabelText,
  TextFieldRoot
} from "~/components/TextField";
import { useI18n } from "~/contexts/I18nContext";
import { setBoardAccessAction } from "~/server/access/client";
import { updateUserAction } from "~/server/auth/client";
import { randomHexColor } from "~/utils/colors";

const defaultPlayerColor = randomHexColor();

export const IntroForm: Component = () => {
  const { t } = useI18n();

  const submission = useSubmission(updateUserAction);

  return (
    <Card class="w-full max-w-md" variant="bordered">
      <CardBody>
        <header class="flex items-center justify-between gap-2">
          <h2 class={cardTitleClass()}>{t("intro.title")}</h2>
        </header>
        <form
          action={setBoardAccessAction}
          class="flex flex-col gap-4"
          method="post"
        >
          <TextFieldRoot>
            <TextFieldLabel for="name">
              <TextFieldLabelText>{t("intro.name")}</TextFieldLabelText>
            </TextFieldLabel>
            <TextFieldInput
              id="name"
              name="name"
              placeholder={t("intro.name")}
              variant="bordered"
            />
          </TextFieldRoot>
          <TextFieldRoot>
            <TextFieldLabel for="color">
              <TextFieldLabelText>{t("intro.color")}</TextFieldLabelText>
            </TextFieldLabel>
            <TextFieldInput
              id="color"
              name="color"
              placeholder={t("intro.color")}
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
            {t("intro.save")}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

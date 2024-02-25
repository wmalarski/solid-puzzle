import { useSubmission } from "@solidjs/router";
import { Show } from "solid-js";

import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import { Card, CardBody, cardTitleClass } from "~/components/Card";
import {
  TextFieldInput,
  TextFieldLabel,
  TextFieldLabelText,
  TextFieldRoot
} from "~/components/TextField";
import { useI18n } from "~/contexts/I18nContext";
import { updateUserAction } from "~/server/auth/client";
import { randomHexColor } from "~/utils/colors";

const defaultPlayerColor = randomHexColor();

export function IntroForm() {
  const { t } = useI18n();

  const submission = useSubmission(updateUserAction);

  return (
    <Card bg="base-200" class="w-full max-w-md" variant="bordered">
      <CardBody>
        <header class="flex items-center justify-between gap-2">
          <h2 class={cardTitleClass()}>{t("intro.title")}</h2>
        </header>
        <form
          action={updateUserAction}
          class="flex flex-col gap-4"
          method="post"
        >
          <Show when={submission.result?.error}>
            <Alert variant="error">
              <AlertIcon variant="error" />
              {submission.result?.error}
            </Alert>
          </Show>
          <TextFieldRoot>
            <TextFieldLabel for="name">
              <TextFieldLabelText>{t("intro.name")}</TextFieldLabelText>
            </TextFieldLabel>
            <TextFieldInput
              disabled={submission.pending}
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
              disabled={submission.pending}
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
            color="secondary"
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
}

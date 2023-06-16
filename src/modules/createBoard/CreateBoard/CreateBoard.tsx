import { useI18n } from "@solid-primitives/i18n";
import { Show, type Component } from "solid-js";
import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import { Card, CardBody, cardTitleClass } from "~/components/Card";
import {
  TextFieldInput,
  TextFieldLabel,
  TextFieldLabelText,
  TextFieldRoot,
} from "~/components/TextField";
import { createSignInServerAction } from "~/server/auth";

export const CreateBoard: Component = () => {
  const [t] = useI18n();

  const [signOut, { Form }] = createSignInServerAction();

  return (
    <Card variant="bordered" class="w-full max-w-md">
      <CardBody>
        <header class="flex items-center justify-between gap-2">
          <h2 class={cardTitleClass()}>{t("createBoard.title")}</h2>
        </header>
        <Form class="flex flex-col gap-4">
          <Show when={signOut.error}>
            {(error) => (
              <Alert variant="error">
                <AlertIcon variant="error" />
                {error().message}
              </Alert>
            )}
          </Show>
          <TextFieldRoot>
            <TextFieldLabel for="name">
              <TextFieldLabelText>
                {t("createBoard.name.label")}
              </TextFieldLabelText>
            </TextFieldLabel>
            <TextFieldInput
              id="name"
              name="name"
              placeholder={t("createBoard.name.placeholder")}
              variant="bordered"
            />
          </TextFieldRoot>
          <TextFieldRoot>
            <TextFieldLabel for="columns">
              <TextFieldLabelText>
                {t("createBoard.columns.label")}
              </TextFieldLabelText>
            </TextFieldLabel>
            <TextFieldInput
              id="columns"
              max={20}
              min={3}
              name="columns"
              placeholder={t("createBoard.columns.placeholder")}
              step={1}
              type="number"
              value={10}
              variant="bordered"
            />
          </TextFieldRoot>
          <TextFieldRoot>
            <TextFieldLabel for="rows">
              <TextFieldLabelText>
                {t("createBoard.rows.label")}
              </TextFieldLabelText>
            </TextFieldLabel>
            <TextFieldInput
              id="rows"
              max={20}
              min={3}
              name="rows"
              placeholder={t("createBoard.rows.placeholder")}
              step={1}
              type="number"
              value={10}
              variant="bordered"
            />
          </TextFieldRoot>
          <Button
            disabled={signOut.pending}
            isLoading={signOut.pending}
            type="submit"
          >
            {t("createBoard.button")}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

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
import { insertBoardAction } from "~/server/board";
import { ImageGrid } from "../ImageGrid";

export const CreateBoard: Component = () => {
  const [t] = useI18n();

  const [insertBoard, { Form }] = insertBoardAction();

  return (
    <Card variant="bordered" class="mt-4 w-full max-w-xl sm:mt-12">
      <CardBody>
        <header class="flex items-center justify-between gap-2">
          <h2 class={cardTitleClass()}>{t("createBoard.title")}</h2>
        </header>
        <Form class="flex flex-col gap-4">
          <Show when={insertBoard.error}>
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
          <ImageGrid name="image" />
          <Button
            disabled={insertBoard.pending}
            isLoading={insertBoard.pending}
            type="submit"
          >
            {t("createBoard.button")}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};
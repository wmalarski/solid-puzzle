import { useI18n } from "@solid-primitives/i18n";
import { Show, type Component } from "solid-js";
import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import {
  TextFieldInput,
  TextFieldLabel,
  TextFieldLabelText,
  TextFieldRoot,
} from "~/components/TextField";
import { insertBoardAction } from "~/server/board/actions";
import { ImageGrid } from "../ImageGrid";

type CreateBoardFormProps = {
  image?: string;
};

export const CreateBoardForm: Component<CreateBoardFormProps> = (props) => {
  const [t] = useI18n();

  const [insertBoard, { Form }] = insertBoardAction();

  return (
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
          <TextFieldLabelText>{t("createBoard.name.label")}</TextFieldLabelText>
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
          <TextFieldLabelText>{t("createBoard.rows.label")}</TextFieldLabelText>
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
      <Show when={props.image} fallback={<ImageGrid hasDefault name="image" />}>
        {(image) => <input type="hidden" name="image" value={image()} />}
      </Show>
      <Button
        disabled={insertBoard.pending}
        isLoading={insertBoard.pending}
        type="submit"
      >
        {t("createBoard.button")}
      </Button>
    </Form>
  );
};

import { type Component, Show } from "solid-js";

import {
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
  TextFieldLabelText,
  TextFieldRoot
} from "~/components/TextField";
import { useI18n } from "~/contexts/I18nContext";

import { ImageGrid } from "../ImageGrid";

export type BoardConfigFields = {
  columns: number;
  image: string;
  name: string;
  rows: number;
};

type ConfigFieldsProps = {
  errors?: Record<string, string>;
  initialValues?: BoardConfigFields | null;
  scrollableImageGrid: boolean;
};

export const ConfigFields: Component<ConfigFieldsProps> = (props) => {
  const { t } = useI18n();

  return (
    <div class="flex flex-col gap-4">
      <TextFieldRoot>
        <TextFieldLabel for="name">
          <TextFieldLabelText>{t("createBoard.name.label")}</TextFieldLabelText>
        </TextFieldLabel>
        <TextFieldInput
          id="name"
          name="name"
          placeholder={t("createBoard.name.placeholder")}
          value={props.initialValues?.name}
          variant="bordered"
        />
        <Show when={props.errors?.name}>
          <TextFieldErrorMessage>{props.errors?.name}</TextFieldErrorMessage>
        </Show>
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
          value={props.initialValues?.columns || 10}
          variant="bordered"
        />
        <Show when={props.errors?.columns}>
          <TextFieldErrorMessage>{props.errors?.columns}</TextFieldErrorMessage>
        </Show>
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
          value={props.initialValues?.rows || 10}
          variant="bordered"
        />
        <Show when={props.errors?.rows}>
          <TextFieldErrorMessage>{props.errors?.rows}</TextFieldErrorMessage>
        </Show>
      </TextFieldRoot>
      <ImageGrid scrollable={props.scrollableImageGrid} />
      <Show when={props.errors?.image}>
        <TextFieldErrorMessage>{props.errors?.image}</TextFieldErrorMessage>
      </Show>
    </div>
  );
};

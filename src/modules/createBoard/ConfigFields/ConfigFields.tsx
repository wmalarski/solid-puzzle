import { type Component, Show } from "solid-js";

import {
  TextFieldErrorMessage,
  TextFieldInput,
  TextFieldLabel,
  TextFieldLabelText,
  TextFieldRoot
} from "~/components/TextField";
import { useI18n } from "~/contexts/I18nContext";
import {
  BOARD_MAX_NAME_LENGTH,
  BOARD_MAX_SIZE,
  BOARD_MIN_NAME_LENGTH,
  BOARD_MIN_SIZE
} from "~/server/board/const";

import { ImageGrid } from "../ImageGrid";

export type BoardConfigFields = {
  columns: number;
  image: string;
  name: string;
  rows: number;
};

const INITIAL_BOARD_SIZE = 5;

type ConfigFieldsProps = {
  disabled: boolean;
  errors?: Record<string, string>;
  initialValues?: BoardConfigFields | null;
  scrollableImageGrid: boolean;
  showName: boolean;
};

export const ConfigFields: Component<ConfigFieldsProps> = (props) => {
  const { t } = useI18n();

  return (
    <div class="flex flex-col gap-4">
      <Show when={props.showName}>
        <TextFieldRoot>
          <TextFieldLabel for="name">
            <TextFieldLabelText>
              {t("createBoard.name.label")}
            </TextFieldLabelText>
          </TextFieldLabel>
          <TextFieldInput
            disabled={props.disabled}
            id="name"
            maxlength={BOARD_MAX_NAME_LENGTH}
            minLength={BOARD_MIN_NAME_LENGTH}
            name="name"
            placeholder={t("createBoard.name.placeholder")}
            value={props.initialValues?.name}
            variant="bordered"
          />
          <Show when={props.errors?.name}>
            <TextFieldErrorMessage>{props.errors?.name}</TextFieldErrorMessage>
          </Show>
        </TextFieldRoot>
      </Show>
      <TextFieldRoot>
        <TextFieldLabel for="columns">
          <TextFieldLabelText>
            {t("createBoard.columns.label")}
          </TextFieldLabelText>
        </TextFieldLabel>
        <TextFieldInput
          disabled={props.disabled}
          id="columns"
          max={BOARD_MAX_SIZE}
          min={BOARD_MIN_SIZE}
          name="columns"
          placeholder={t("createBoard.columns.placeholder")}
          step={1}
          type="number"
          value={props.initialValues?.columns || INITIAL_BOARD_SIZE}
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
          disabled={props.disabled}
          id="rows"
          max={BOARD_MAX_SIZE}
          min={BOARD_MIN_SIZE}
          name="rows"
          placeholder={t("createBoard.rows.placeholder")}
          step={1}
          type="number"
          value={props.initialValues?.rows || INITIAL_BOARD_SIZE}
          variant="bordered"
        />
        <Show when={props.errors?.rows}>
          <TextFieldErrorMessage>{props.errors?.rows}</TextFieldErrorMessage>
        </Show>
      </TextFieldRoot>
      <ImageGrid
        disabled={props.disabled}
        scrollable={props.scrollableImageGrid}
      />
      <Show when={props.errors?.image}>
        <TextFieldErrorMessage>{props.errors?.image}</TextFieldErrorMessage>
      </Show>
    </div>
  );
};

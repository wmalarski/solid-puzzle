import { useI18n } from "@solid-primitives/i18n";
import { Show, type Component } from "solid-js";
import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import { insertBoardAction } from "~/server/board/actions";
import { ConfigFields } from "../ConfigFields";

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
      <ConfigFields image={props.image} />
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

import { useI18n } from "@solid-primitives/i18n";
import { Show, type Component } from "solid-js";
import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import { ConfigFields } from "~/modules/createBoard/ConfigFields";
import { updateBoardAction } from "~/server/board/actions";

type UpdateFormProps = {
  boardId: string;
};

export const UpdateForm: Component<UpdateFormProps> = (props) => {
  const [t] = useI18n();

  const [updateBoard, { Form }] = updateBoardAction();

  return (
    <Form class="flex flex-col gap-4">
      <Show when={updateBoard.error}>
        {(error) => (
          <Alert variant="error">
            <AlertIcon variant="error" />
            {error().message}
          </Alert>
        )}
      </Show>
      <input name="id" value={props.boardId} type="hidden" />
      <ConfigFields />
      <Button
        disabled={updateBoard.pending}
        isLoading={updateBoard.pending}
        type="submit"
      >
        {t("board.settings.update.button")}
      </Button>
    </Form>
  );
};

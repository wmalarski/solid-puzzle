import { useSubmission } from "@solidjs/router";
import { Show, type Component } from "solid-js";
import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import { useI18n } from "~/contexts/I18nContext";
import { ConfigFields } from "~/modules/createBoard/ConfigFields";
import { updateBoardAction } from "~/server/board/client";

type UpdateFormProps = {
  boardId: string;
};

export const UpdateForm: Component<UpdateFormProps> = (props) => {
  const { t } = useI18n();

  const submission = useSubmission(updateBoardAction);

  return (
    <form action={updateBoardAction} class="flex flex-col gap-4" method="post">
      <Show when={submission.result && submission.result < 1}>
        <Alert variant="error">
          <AlertIcon variant="error" />
          Error
        </Alert>
      </Show>
      <input name="id" value={props.boardId} type="hidden" />
      <ConfigFields />
      <Button
        disabled={submission.pending}
        isLoading={submission.pending}
        type="submit"
      >
        {t("board.settings.update.button")}
      </Button>
    </form>
  );
};

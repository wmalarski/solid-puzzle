import { useSubmission } from "@solidjs/router";
import { Show, type Component } from "solid-js";
import { Alert, AlertIcon } from "~/components/Alert";
import { Button } from "~/components/Button";
import { useI18n } from "~/contexts/I18nContext";
import { insertBoardAction } from "~/server/board/client";
import { ConfigFields } from "../ConfigFields";

type CreateBoardFormProps = {
  image?: string;
};

export const CreateBoardForm: Component<CreateBoardFormProps> = (props) => {
  const { t } = useI18n();

  const submission = useSubmission(insertBoardAction);

  return (
    <form action={insertBoardAction} class="flex flex-col gap-4">
      <Show when={submission.result}>
        <Alert variant="error">
          <AlertIcon variant="error" />
          Error
        </Alert>
      </Show>
      <ConfigFields image={props.image} />
      <Button
        disabled={submission.pending}
        isLoading={submission.pending}
        type="submit"
      >
        {t("createBoard.button")}
      </Button>
    </form>
  );
};
